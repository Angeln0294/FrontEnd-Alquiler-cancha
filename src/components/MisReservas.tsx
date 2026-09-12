import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
}

interface Cancha {
  _id: string;
  nombre: string;
  tipo: string;
  precio: number;
}

interface Reserva {
  _id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
  estado: "pendiente" | "confirmada" | "cancelada";
  usuario: Usuario;
  cancha: Cancha;
}

export default function MisReservas() {
  const navigate = useNavigate();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [procesando, setProcesando] = useState<string | null>(null);

  // ==============================
  // CARGAR RESERVAS
  // ==============================

  const cargarReservas = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch("http://localhost:3003/api/reservas", {
        credentials: "include",
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "No se pudieron obtener las reservas",
        );
      }

      setReservas(resultado.reservas || []);
    } catch (error) {
      console.error("Error al obtener reservas:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudieron cargar las reservas",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al obtener tus reservas.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#22c55e",
        background: "#1e293b",
        color: "#f8fafc",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  // ==============================
  // FORMATEAR FECHA
  // ==============================

  const formatearFecha = (fecha: string) => {
    const fechaFormateada = new Date(fecha);

    return fechaFormateada.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==============================
  // CANCELAR RESERVA
  // ==============================

  const cancelarReserva = async (reserva: Reserva) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Cancelar reserva?",
      html: `
        <div style="color: #cbd5e1;">
          <p>Vas a cancelar la reserva de:</p>

          <strong style="color: #f8fafc;">
            ${reserva.cancha?.nombre || "Cancha"}
          </strong>

          <p style="margin-top: 8px;">
            ${formatearFecha(reserva.fecha)}
            · ${reserva.horaInicio} - ${reserva.horaFin}
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: "#1e293b",
      color: "#f8fafc",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      setProcesando(reserva._id);

      const respuesta = await fetch(
        `http://localhost:3003/api/reservas/${reserva._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo cancelar la reserva");
      }

      setReservas((reservasActuales) =>
        reservasActuales.map((reservaActual) =>
          reservaActual._id === reserva._id
            ? {
                ...reservaActual,
                estado: "cancelada",
              }
            : reservaActual,
        ),
      );

      await Swal.fire({
        icon: "success",
        title: "Reserva cancelada",
        text: "La reserva se canceló correctamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#22c55e",
        background: "#1e293b",
        color: "#f8fafc",
      });
    } catch (error) {
      console.error("Error al cancelar reserva:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudo cancelar",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al cancelar la reserva.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#22c55e",
        background: "#1e293b",
        color: "#f8fafc",
      });
    } finally {
      setProcesando(null);
    }
  };

  // ==============================
  // PAGAR RESERVA
  // ==============================

  const pagarReserva = async (reserva: Reserva) => {
    try {
      setProcesando(reserva._id);

      const respuesta = await fetch(
        "http://localhost:3003/api/pago/crear-preferencia-reserva",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            reservaId: reserva._id,
          }),
        },
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "No se pudo crear la preferencia de pago",
        );
      }

      if (!resultado.init_point) {
        throw new Error("Mercado Pago no devolvió el enlace de pago.");
      }

      window.location.href = resultado.init_point;
    } catch (error) {
      console.error("Error al iniciar el pago:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudo iniciar el pago",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al generar el pago.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#22c55e",
        background: "#1e293b",
        color: "#f8fafc",
      });

      setProcesando(null);
    }
  };

  // ==============================
  // ESTADO
  // ==============================

  const obtenerClaseEstado = (estado: Reserva["estado"]) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "pendiente":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "cancelada":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const obtenerTextoEstado = (estado: Reserva["estado"]) => {
    switch (estado) {
      case "confirmada":
        return "Confirmada";

      case "pendiente":
        return "Pendiente";

      case "cancelada":
        return "Cancelada";

      default:
        return estado;
    }
  };

  // ==============================
  // CARGANDO
  // ==============================

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-slate-400 text-sm">Cargando tus reservas...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // PÁGINA
  // ==============================

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Mis reservas
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Consultá y administrá tus reservas de canchas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/canchas")}
            className="w-fit text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            ← Reservar cancha
          </button>
        </div>

        {/* SIN RESERVAS */}
        {reservas.length === 0 ? (
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
            <div className="text-5xl mb-5">⚽</div>

            <h2 className="text-lg font-bold text-white">
              Todavía no tenés reservas
            </h2>

            <p className="text-sm text-slate-400 mt-2 mb-6">
              Cuando reserves una cancha, aparecerá aquí.
            </p>

            <button
              type="button"
              onClick={() => navigate("/canchas")}
              className="bg-[#22c55e] text-[#0b132b] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e]/90 transition-all cursor-pointer"
            >
              Ver canchas
            </button>
          </div>
        ) : (
          /* TABLA */
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Scroll horizontal para celulares */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-sm">
                {/* CABECERA */}
                <thead className="bg-[#16213d] border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Cancha
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Tipo
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Fecha
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Horario
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-center text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Estado
                    </th>

                    <th className="px-5 py-4 text-center text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>

                {/* CUERPO */}
                <tbody className="divide-y divide-slate-800">
                  {reservas.map((reserva) => (
                    <tr
                      key={reserva._id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* CANCHA */}
                      <td className="px-5 py-5">
                        <p className="font-bold text-white">
                          {reserva.cancha?.nombre || "Cancha"}
                        </p>
                      </td>

                      {/* TIPO */}
                      <td className="px-5 py-5">
                        <span className="text-xs text-slate-400">
                          {reserva.cancha?.tipo || "-"}
                        </span>
                      </td>

                      {/* FECHA */}
                      <td className="px-5 py-5">
                        <span className="text-sm text-slate-200 font-medium">
                          {formatearFecha(reserva.fecha)}
                        </span>
                      </td>

                      {/* HORARIO */}
                      <td className="px-5 py-5">
                        <span className="text-sm text-slate-200 font-medium">
                          {reserva.horaInicio} - {reserva.horaFin}
                        </span>
                      </td>

                      {/* TOTAL */}
                      <td className="px-5 py-5">
                        <span className="text-sm font-black text-green-400">
                          ${reserva.precio.toLocaleString("es-AR")}
                        </span>
                      </td>

                      {/* ESTADO */}
                      <td className="px-5 py-5 text-center">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${obtenerClaseEstado(
                            reserva.estado,
                          )}`}
                        >
                          {obtenerTextoEstado(reserva.estado)}
                        </span>
                      </td>

                      {/* ACCIONES */}
                      <td className="px-5 py-5">
                        {reserva.estado === "cancelada" ? (
                          <div className="text-center">
                            <span className="text-xs text-red-400 font-medium">
                              Cancelada
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            {/* PAGAR */}
                            {reserva.estado === "pendiente" && (
                              <button
                                type="button"
                                disabled={procesando === reserva._id}
                                onClick={() => pagarReserva(reserva)}
                                className="bg-green-500 text-slate-950 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                              >
                                {procesando === reserva._id
                                  ? "Procesando..."
                                  : "💳 Pagar"}
                              </button>
                            )}

                            {/* CANCELAR */}
                            <button
                              type="button"
                              disabled={procesando === reserva._id}
                              onClick={() => cancelarReserva(reserva)}
                              className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                            >
                              {procesando === reserva._id
                                ? "Procesando..."
                                : "✕ Cancelar"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
