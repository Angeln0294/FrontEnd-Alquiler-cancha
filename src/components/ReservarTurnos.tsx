import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface HorarioTurno {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export default function ReservasPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Datos recibidos desde la tarjeta de la cancha
  const canchaId = searchParams.get("canchaId");
  const nombreCanchaUrl = searchParams.get("cancha") || "Cancha 5 - Fútbol 7";
  const precioCanchaUrl = searchParams.get("precio") || "12000";
  const imagenCanchaUrl = searchParams.get("imagen") || "";

  // Calendario
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    const hoy = new Date();

    return [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, "0"),
      String(hoy.getDate()).padStart(2, "0"),
    ].join("-");
  });

  const fechaCalendario = new Date(`${fechaSeleccionada}T00:00:00`);

  const calendarDay = fechaCalendario.getDate();
  const calendarMonth = fechaCalendario.getMonth();
  const calendarYear = fechaCalendario.getFullYear();
  const primerDiaDelMes = new Date(calendarYear, calendarMonth, 1).getDay();

  const diasDelMes = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  const nombreMes = fechaCalendario.toLocaleDateString("es-AR", {
    month: "long",
  });

  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const mesActual = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1);

  const mesMostrado = new Date(calendarYear, calendarMonth, 1);

  const puedeRetroceder = mesMostrado > mesActual;
  const cambiarMes = (direccion: number) => {
    const nuevaFecha = new Date(calendarYear, calendarMonth + direccion, 1);

    const fechaFormateada = [
      nuevaFecha.getFullYear(),
      String(nuevaFecha.getMonth() + 1).padStart(2, "0"),
      "01",
    ].join("-");

    setFechaSeleccionada(fechaFormateada);
  };
  const seleccionarDia = (dia: number) => {
    const nuevaFecha = new Date(calendarYear, calendarMonth, dia);

    nuevaFecha.setHours(0, 0, 0, 0);

    if (nuevaFecha < fechaHoy) {
      return;
    }

    const fechaFormateada = [
      nuevaFecha.getFullYear(),
      String(nuevaFecha.getMonth() + 1).padStart(2, "0"),
      String(nuevaFecha.getDate()).padStart(2, "0"),
    ].join("-");

    setFechaSeleccionada(fechaFormateada);
  };

  const [reservando, setReservando] = useState(false);
  // Turnos
  const [turnos, setTurnos] = useState<HorarioTurno[]>([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string | null>(
    null,
  );
  const [cargandoTurnos, setCargandoTurnos] = useState(false);

  // --------------------------------------------------
  // OBTENER DISPONIBILIDAD
  // --------------------------------------------------

  useEffect(() => {
    const cargarDisponibilidad = async () => {
      if (!canchaId) {
        console.error("No se recibió el ID de la cancha");
        return;
      }

      try {
        setCargandoTurnos(true);
        setTurnoSeleccionado(null);

        const respuesta = await fetch(
          `http://localhost:3003/api/reservas/disponibilidad/${canchaId}/${fechaSeleccionada}`,
          {
            credentials: "include",
          },
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            resultado.mensaje || "No se pudo obtener la disponibilidad",
          );
        }

        setTurnos(resultado.turnos || []);
      } catch (error) {
        console.error("Error al obtener disponibilidad:", error);
        setTurnos([]);
      } finally {
        setCargandoTurnos(false);
      }
    };

    cargarDisponibilidad();
  }, [canchaId, fechaSeleccionada]);

  // --------------------------------------------------
  // PRECIO
  // --------------------------------------------------

  const precioNumero = Number(precioCanchaUrl);

  const esHorarioPromo =
    turnoSeleccionado === "22:00" || turnoSeleccionado === "23:00";

  const precioFinalNumero = esHorarioPromo ? precioNumero * 0.8 : precioNumero;

  const precioFinalFormateado = `$${precioFinalNumero.toLocaleString("es-AR")}`;

  // --------------------------------------------------
  // TURNO ACTUAL
  // --------------------------------------------------

  const turnoActual = turnos.find(
    (turno) => turno.horaInicio === turnoSeleccionado,
  );

  // --------------------------------------------------
  // SELECCIONAR TURNO
  // --------------------------------------------------

  const handleSeleccionarTurno = (horaInicio: string) => {
    setTurnoSeleccionado(horaInicio);
  };
  const handleConfirmarReserva = async () => {
    if (!canchaId || !turnoSeleccionado) {
      return;
    }

    try {
      setReservando(true);
    

      // 1. Crear la reserva
      const respuesta = await fetch("http://localhost:3003/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cancha: canchaId,
          fecha: fechaSeleccionada,
          horaInicio: turnoSeleccionado,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo realizar la reserva");
      }

      const reservaId = resultado.reserva?._id;

      if (!reservaId) {
        throw new Error("La reserva fue creada, pero no se recibió su ID");
      }

      // 2. Crear preferencia de Mercado Pago
      const respuestaPago = await fetch(
        "http://localhost:3003/api/pago/crear-preferencia-reserva",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            reservaId,
          }),
        },
      );

      const resultadoPago = await respuestaPago.json();

      if (!respuestaPago.ok) {
        throw new Error(
          resultadoPago.mensaje || "No se pudo crear la preferencia de pago",
        );
      }

      // 3. Mostrar confirmación
      const confirmacion = await Swal.fire({
        icon: "success",
        title: "¡Reserva creada correctamente!",
        text: "Serás redirigido a Mercado Pago para realizar el pago.",
        confirmButtonText: "Ir a pagar",
        cancelButtonText: "Pagar más tarde",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#64748b",
        background: "#1e293b",
        color: "#f8fafc",
      });

      // 4. Redirigir a Mercado Pago
      if (confirmacion.isConfirmed) {
        window.location.href = resultadoPago.init_point;
        return;
      }

      // Si el usuario decide pagar más tarde
      setTurnoSeleccionado(null);

      const disponibilidad = await fetch(
        `http://localhost:3003/api/reservas/disponibilidad/${canchaId}/${fechaSeleccionada}`,
        {
          credentials: "include",
        },
      );

      const datosDisponibilidad = await disponibilidad.json();

      if (disponibilidad.ok) {
        setTurnos(datosDisponibilidad.turnos || []);
      }
    } catch (error) {
      console.error("Error al confirmar reserva:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudo completar la reserva",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al realizar la reserva.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#22c55e",
        background: "#1e293b",
        color: "#f8fafc",
      });
    } finally {
      setReservando(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* VOLVER */}

        <button
          type="button"
          onClick={() => navigate("/canchas")}
          className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer mb-2"
        >
          ← Volver a canchas
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Reserva de Cancha
        </h1>

        {/* CONTENIDO */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMNA IZQUIERDA */}

          <div className="lg:col-span-5 space-y-6">
            {/* INFORMACIÓN CANCHA */}

            <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <div className="w-full h-56 bg-slate-900 overflow-hidden">
                {imagenCanchaUrl ? (
                  <img
                    src={imagenCanchaUrl}
                    alt={`Imagen de ${nombreCanchaUrl}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-500 text-sm">
                      Imagen no disponible
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                <h4 className="text-lg font-bold text-white">
                  {nombreCanchaUrl}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Estás visualizando la disponibilidad para {nombreCanchaUrl}.
                  Seleccioná el día y el horario que quieras reservar.
                </p>
              </div>
            </div>

            {/* CALENDARIO */}

            <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={() => cambiarMes(-1)}
                  disabled={!puedeRetroceder}
                  className={`font-bold transition-colors ${
                    puedeRetroceder
                      ? "text-slate-400 hover:text-white cursor-pointer"
                      : "text-slate-700 cursor-not-allowed"
                  }`}
                >
                  &lt;
                </button>

                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {nombreMes} {calendarYear}
                </span>

                <button
                  type="button"
                  onClick={() => cambiarMes(1)}
                  className="text-slate-400 hover:text-white transition-colors font-bold"
                >
                  &gt;
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-500 mb-2 uppercase">
                <span>Dom</span>
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* ESPACIOS ANTES DEL PRIMER DÍA */}

                {Array.from({ length: primerDiaDelMes }).map((_, index) => (
                  <span key={`vacio-${index}`} className="py-2" />
                ))}

                {/* DÍAS DEL MES */}

                {Array.from({ length: diasDelMes }, (_, i) => i + 1).map(
                  (dia) => {
                    const fechaDia = new Date(calendarYear, calendarMonth, dia);

                    fechaDia.setHours(0, 0, 0, 0);

                    const esPasado = fechaDia < fechaHoy;

                    const isSelected =
                      dia === calendarDay &&
                      calendarMonth === fechaCalendario.getMonth() &&
                      calendarYear === fechaCalendario.getFullYear();

                    return (
                      <button
                        key={dia}
                        type="button"
                        disabled={esPasado}
                        onClick={() => seleccionarDia(dia)}
                        className={`py-2 rounded-lg font-bold transition-all ${
                          isSelected
                            ? "bg-[#22c55e] text-[#0b132b] font-black shadow-md shadow-green-500/20"
                            : esPasado
                              ? "text-slate-700 cursor-not-allowed"
                              : "text-slate-300 hover:bg-[#0b132b] border border-transparent hover:border-slate-800 cursor-pointer"
                        }`}
                      >
                        {dia}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}

          <div className="lg:col-span-7 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 h-full">
            {/* HORARIOS */}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Seleccionar Horario
              </h4>

              {cargandoTurnos ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">
                    Consultando disponibilidad...
                  </p>
                </div>
              ) : turnos.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">
                    No se pudo obtener la disponibilidad.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {turnos.map((turno) => {
                    const seleccionado = turno.horaInicio === turnoSeleccionado;

                    // TURNO OCUPADO

                    if (!turno.disponible) {
                      return (
                        <div
                          key={turno.horaInicio}
                          className="bg-[#0b132b]/40 border border-slate-800/80 text-slate-600 rounded-xl p-3 text-center cursor-not-allowed line-through flex flex-col justify-center h-14"
                        >
                          <span className="text-xs font-medium">
                            {turno.horaInicio} - {turno.horaFin}
                          </span>

                          <span className="text-[9px] uppercase tracking-wider text-red-500/50 font-black mt-0.5">
                            Ocupado
                          </span>
                        </div>
                      );
                    }

                    // TURNO SELECCIONADO

                    if (seleccionado) {
                      return (
                        <button
                          key={turno.horaInicio}
                          type="button"
                          onClick={() =>
                            handleSeleccionarTurno(turno.horaInicio)
                          }
                          className="bg-[#22c55e] text-[#0b132b] font-black rounded-xl p-3 text-center flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 h-14 w-full cursor-pointer border border-[#22c55e]"
                        >
                          <span className="text-xs tracking-wide">
                            {turno.horaInicio} - {turno.horaFin}
                          </span>

                          <span className="text-xs">✓</span>
                        </button>
                      );
                    }

                    // TURNO DISPONIBLE

                    return (
                      <button
                        key={turno.horaInicio}
                        type="button"
                        onClick={() => handleSeleccionarTurno(turno.horaInicio)}
                        className="bg-[#0b132b] border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl p-3 text-center text-xs font-bold transition-all h-14 hover:bg-[#0b132b]/80 cursor-pointer"
                      >
                        {turno.horaInicio} - {turno.horaFin}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RESUMEN */}

            <div className="bg-[#0b132b] p-5 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-2">
                Resumen de Reserva
              </h4>

              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Fecha:</span>

                  <span className="text-slate-200 font-bold">
                    {calendarDay} de{" "}
                    {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} de{" "}
                    {calendarYear}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Hora:</span>

                  <span className="text-slate-200 font-bold">
                    {turnoActual
                      ? `${turnoActual.horaInicio} - ${turnoActual.horaFin}`
                      : "No seleccionado"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Cancha:</span>

                  <span className="text-slate-200 font-bold">
                    {nombreCanchaUrl}
                  </span>
                </div>

                {/* PROMO */}

                {esHorarioPromo && (
                  <div className="flex justify-between items-center text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-1.5 rounded-lg border border-green-500/20 uppercase tracking-wider">
                    <span>¡Promo Nocturna Aplicada!</span>
                    <span>-20% OFF</span>
                  </div>
                )}

                {/* TOTAL */}

                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-800/80">
                  <span className="text-slate-300 font-black">Total:</span>

                  <span className="text-green-400 font-black text-lg">
                    {precioFinalFormateado}
                  </span>
                </div>
              </div>

              {/* CONFIRMAR */}

              <button
                type="button"
                onClick={handleConfirmarReserva}
                disabled={!turnoSeleccionado || reservando}
                className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  turnoSeleccionado
                    ? "bg-[#22c55e] text-[#0b132b] hover:bg-[#22c55e]/90 shadow-md shadow-green-500/10"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {reservando ? "Reservando..." : "Confirmar Reserva"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
