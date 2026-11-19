import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";

interface HorarioTurno {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

interface CanchaDetalle {
  _id: string;
  nombre: string;
  precio: number;
  imagen: string;
  tipo?: string;
}

export default function ReservasPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { usuario, cargando: cargandoUsuario } = useAuth();

  const canchaId = searchParams.get("canchaId");

  // Estados para almacenar los datos reales obtenidos del backend
  const [cancha, setCancha] = useState<CanchaDetalle | null>(null);
  const [cargandoCancha, setCargandoCancha] = useState(true);

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

    if (nuevaFecha < fechaHoy) return;

    const fechaFormateada = [
      nuevaFecha.getFullYear(),
      String(nuevaFecha.getMonth() + 1).padStart(2, "0"),
      String(nuevaFecha.getDate()).padStart(2, "0"),
    ].join("-");
    setFechaSeleccionada(fechaFormateada);
  };

  const [reservando, setReservando] = useState(false);
  const reservaEnProceso = useRef(false);
  const [turnos, setTurnos] = useState<HorarioTurno[]>([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string | null>(
    null,
  );
  const [cargandoTurnos, setCargandoTurnos] = useState(false);

  // Validar sesión de usuario
  useEffect(() => {
    if (cargandoUsuario) return;

    if (!usuario) {
      Swal.fire({
        icon: "warning",
        title: "Iniciá sesión",
        text: "Debés iniciar sesión para poder reservar una cancha.",
        confirmButtonText: "Iniciar sesión",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
  }, [usuario, cargandoUsuario, navigate]);

  useEffect(() => {
    const cargarDetallesCancha = async () => {
      if (!canchaId) {
        setCargandoCancha(false);
        return;
      }

      try {
        setCargandoCancha(true);
        const resultado = await apiFetch<CanchaDetalle>(
          `/api/canchas/${canchaId}`,
          { method: "GET" },
        );

        setCancha(resultado);
      } catch (error) {
        console.error("Error al cargar la cancha:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información de la cancha.",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#22c55e",
        });
      } finally {
        setCargandoCancha(false);
      }
    };

    cargarDetallesCancha();
  }, [canchaId]);

  useEffect(() => {
    const controller = new AbortController();
    const cargarDisponibilidad = async () => {
      if (!canchaId) return;

      try {
        setCargandoTurnos(true);
        setTurnoSeleccionado(null);

        const resultado = await apiFetch<{ turnos: HorarioTurno[] }>(
          `/api/reservas/disponibilidad/${canchaId}/${fechaSeleccionada}`,
          { method: "GET", signal: controller.signal },
        );

        setTurnos(resultado.turnos || []);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Error al obtener disponibilidad:", error);
        setTurnos([]);
      } finally {
        if (!controller.signal.aborted) {
          setCargandoTurnos(false);
        }
      }
    };

    cargarDisponibilidad();

    return () => {
      controller.abort();
    };
  }, [canchaId, fechaSeleccionada]);

  const precioBase = cancha?.precio || 0;
  const esHorarioPromo =
    turnoSeleccionado === "22:00" || turnoSeleccionado === "23:00";
  const precioFinalNumero = esHorarioPromo ? precioBase * 0.8 : precioBase;
  const precioFinalFormateado = `$${precioFinalNumero.toLocaleString("es-AR")}`;

  const turnoActual = turnos.find(
    (turno) => turno.horaInicio === turnoSeleccionado,
  );

  const handleSeleccionarTurno = (horaInicio: string) => {
    setTurnoSeleccionado(horaInicio);
  };

  const handleConfirmarReserva = async () => {
    if (reservaEnProceso.current || !canchaId || !turnoSeleccionado) {
      return;
    }

    reservaEnProceso.current = true;
    let reservaCreada = false;

    try {
      setReservando(true);

      const resultado = await apiFetch<{ reserva: { _id: string } }>(
        "/api/reservas",
        {
          method: "POST",
          body: JSON.stringify({
            cancha: canchaId,
            fecha: fechaSeleccionada,
            horaInicio: turnoSeleccionado,
          }),
        },
      );

      const reservaId = resultado.reserva?._id;
      if (!reservaId) {
        throw new Error("La reserva fue creada, pero no se recibió su ID");
      }
      reservaCreada = true;
      const resultadoPago = await apiFetch<{ init_point: string }>(
        "/api/pago/crear-preferencia-reserva",
        {
          method: "POST",
          body: JSON.stringify({
            reservaId,
          }),
        },
      );

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

      if (confirmacion.isConfirmed) {
        window.location.href = resultadoPago.init_point;
        return;
      }

      setTurnoSeleccionado(null);

      const datosDisponibilidad = await apiFetch<{ turnos: HorarioTurno[] }>(
        `/api/reservas/disponibilidad/${canchaId}/${fechaSeleccionada}`,
        { method: "GET" },
      );

      setTurnos(datosDisponibilidad.turnos || []);
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      Swal.fire({
        icon: "error",
        title: reservaCreada
          ? "La reserva fue creada"
          : "No se pudo completar la reserva",
        text: reservaCreada
          ? "Tu reserva se creó correctamente, pero hubo un problema al generar el pago. Revisá Mis Reservas antes de intentar reservar nuevamente."
          : error instanceof Error
            ? error.message
            : "Ocurrió un error al realizar la reserva.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#22c55e",
        background: "#1e293b",
        color: "#f8fafc",
      });
    } finally {
      reservaEnProceso.current = false;
      setReservando(false);
    }
  };

  if (cargandoCancha) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 flex items-center justify-center">
        <p role="status" className="text-slate-400">
          Cargando detalles de la cancha...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate("/canchas")}
          aria-label="Volver al listado de canchas"
          className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer mb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          ← Volver a canchas
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Reserva de Cancha
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <div className="w-full h-56 bg-slate-900 overflow-hidden">
                {cancha?.imagen ? (
                  <img
                    src={cancha.imagen}
                    alt={`Imagen de ${cancha.nombre}`}
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
                  {cancha?.nombre || "Cancha"}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Estás visualizando la disponibilidad oficial. Seleccioná el
                  día y el horario que quieras reservar.
                </p>
              </div>
            </div>

            {/* Calendario */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={() => cambiarMes(-1)}
                  disabled={!puedeRetroceder}
                  aria-label="Ir al mes anterior"
                  className={`font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
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
                  aria-label="Ir al mes siguiente"
                  className="text-slate-400 hover:text-white transition-colors font-bold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
                {Array.from({ length: primerDiaDelMes }).map((_, index) => (
                  <span key={`vacio-${index}`} className="py-2" />
                ))}

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
                        aria-label={`Seleccionar ${fechaDia.toLocaleDateString(
                          "es-AR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}`}
                        aria-pressed={isSelected}
                        className={`py-2 rounded-lg font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
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

          {/* Horarios y Resumen */}
          <div className="lg:col-span-7 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 h-full">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Seleccionar Horario
              </h4>

              {cargandoTurnos ? (
                <div role="status" className="text-center py-10">
                  <p className="text-slate-400 text-sm">
                    Consultando disponibilidad...
                  </p>
                </div>
              ) : turnos.length === 0 ? (
                <div role="status" className="text-center py-10">
                  <p className="text-slate-400 text-sm">
                    No hay turnos disponibles para esta fecha.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {turnos.map((turno) => {
                    const seleccionado = turno.horaInicio === turnoSeleccionado;
                    const ahora = new Date();

                    const fechaActual = [
                      ahora.getFullYear(),
                      String(ahora.getMonth() + 1).padStart(2, "0"),
                      String(ahora.getDate()).padStart(2, "0"),
                    ].join("-");

                    const horarioPasado =
                      fechaSeleccionada === fechaActual &&
                      new Date(`${fechaSeleccionada}T${turno.horaInicio}`) <=
                        ahora;

                    if (!turno.disponible || horarioPasado) {
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

                    if (seleccionado) {
                      return (
                        <button
                          key={turno.horaInicio}
                          type="button"
                          onClick={() =>
                            handleSeleccionarTurno(turno.horaInicio)
                          }
                          aria-label={`Horario seleccionado: ${turno.horaInicio} a ${turno.horaFin}`}
                          aria-pressed={true}
                          className="bg-[#22c55e] text-[#0b132b] font-black rounded-xl p-3 text-center flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 h-14 w-full cursor-pointer border border-[#22c55e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <span className="text-xs tracking-wide">
                            {turno.horaInicio} - {turno.horaFin}
                          </span>
                          <span className="text-xs">✓</span>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={turno.horaInicio}
                        type="button"
                        onClick={() => handleSeleccionarTurno(turno.horaInicio)}
                        aria-label={`Seleccionar horario de ${turno.horaInicio} a ${turno.horaFin}`}
                        aria-pressed={false}
                        className="bg-[#0b132b] border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl p-3 text-center text-xs font-bold transition-all h-14 hover:bg-[#0b132b]/80 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {turno.horaInicio} - {turno.horaFin}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

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
                    {cancha?.nombre || "Cargando..."}
                  </span>
                </div>

                {esHorarioPromo && (
                  <div className="flex justify-between items-center text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-1.5 rounded-lg border border-green-500/20 uppercase tracking-wider">
                    <span>¡Promo Nocturna Aplicada!</span>
                    <span>-20% OFF</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-800/80">
                  <span className="text-slate-300 font-black">Total:</span>
                  <span className="text-green-400 font-black text-lg">
                    {precioFinalFormateado}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmarReserva}
                disabled={!turnoSeleccionado || reservando || cargandoTurnos}
                aria-label={
                  reservando
                    ? "Procesando reserva"
                    : "Confirmar reserva de cancha"
                }
                className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  turnoSeleccionado
                    ? "bg-[#22c55e] text-[#0b132b] hover:bg-[#22c55e]/90 shadow-md shadow-green-500/10 cursor-pointer"
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
