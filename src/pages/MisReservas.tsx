import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiFetch } from "../services/api";

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
  const [paginaActual, setPaginaActual] = useState(1);
  const [cantidadReservas, setCantidadReservas] = useState(0);
  const reservasPorPagina = 6;

  const cantidadPaginas = Math.ceil(cantidadReservas / reservasPorPagina);

  const cargarReservas = async (signal: AbortSignal) => {
    try {
      setCargando(true);

      const resultado = await apiFetch<{
        reservas: Reserva[];
        cantidadReservas: number;
      }>(`/api/reservas?pagina=${paginaActual}&limite=${reservasPorPagina}`, {
        signal,
      });

      if (signal.aborted) return;

      setReservas(resultado.reservas || []);
      setCantidadReservas(resultado.cantidadReservas || 0);
    } catch (error) {
      if (signal.aborted) return;

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
      if (!signal.aborted) {
        setCargando(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    cargarReservas(controller.signal);

    return () => {
      controller.abort();
    };
  }, [paginaActual]);

  const formatearFecha = (fecha: string) => {
    const fechaFormateada = new Date(fecha);

    return fechaFormateada.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

      await apiFetch(`/api/reservas/${reserva._id}`, {
        method: "DELETE",
      });

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

  const pagarReserva = async (reserva: Reserva) => {
    try {
      setProcesando(reserva._id);

      const resultado = await apiFetch<{
        init_point: string;
      }>("/api/pago/crear-preferencia-reserva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservaId: reserva._id,
        }),
      });

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

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-10 text-center">
            <p
              role="status"
              aria-live="polite"
              className="text-slate-400 text-sm"
            >
              Cargando tus reservas...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            className="w-fit text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            ← Reservar cancha
          </button>
        </div>

        {reservas.length === 0 ? (
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
            <div aria-hidden="true" className="text-5xl mb-5">
              ⚽
            </div>

            <h2 className="text-lg font-bold text-white">
              Todavía no tenés reservas
            </h2>

            <p className="text-sm text-slate-400 mt-2 mb-6">
              Cuando reserves una cancha, aparecerá aquí.
            </p>

            <button
              type="button"
              onClick={() => navigate("/canchas")}
              className="bg-[#22c55e] text-[#0b132b] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e]/90 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Ver canchas
            </button>
          </div>
        ) : (
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Scroll horizontal para celulares */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-sm">
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

                <tbody className="divide-y divide-slate-800">
                  {reservas.map((reserva) => (
                    <tr
                      key={reserva._id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-5">
                        <p className="font-bold text-white">
                          {reserva.cancha?.nombre || "Cancha"}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span className="text-xs text-slate-400">
                          {reserva.cancha?.tipo || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span className="text-sm text-slate-200 font-medium">
                          {formatearFecha(reserva.fecha)}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span className="text-sm text-slate-200 font-medium">
                          {reserva.horaInicio} - {reserva.horaFin}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span className="text-sm font-black text-green-400">
                          ${reserva.precio.toLocaleString("es-AR")}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-center">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${obtenerClaseEstado(
                            reserva.estado,
                          )}`}
                        >
                          {obtenerTextoEstado(reserva.estado)}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        {reserva.estado === "cancelada" ? (
                          <div className="text-center">
                            <span className="text-xs text-red-400 font-medium">
                              Cancelada
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            {reserva.estado === "pendiente" && (
                              <button
                                type="button"
                                disabled={procesando === reserva._id}
                                onClick={() => pagarReserva(reserva)}
                                aria-label={
                                  procesando === reserva._id
                                    ? `Procesando pago de ${reserva.cancha?.nombre || "cancha"}`
                                    : `Pagar reserva de ${reserva.cancha?.nombre || "cancha"} del ${formatearFecha(reserva.fecha)}`
                                }
                                className="bg-green-500 text-slate-950 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                              >
                                {procesando === reserva._id
                                  ? "Procesando..."
                                  : "💳 Pagar"}
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={procesando === reserva._id}
                              onClick={() => cancelarReserva(reserva)}
                              aria-label={
                                procesando === reserva._id
                                  ? `Procesando reserva de ${reserva.cancha?.nombre || "cancha"}`
                                  : `Cancelar reserva de ${reserva.cancha?.nombre || "cancha"} del ${formatearFecha(reserva.fecha)}`
                              }
                              className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
              {cantidadPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 p-5 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((pagina) => pagina - 1)}
                    aria-label="Ir a la página anterior de reservas"
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    ← Anterior
                  </button>

                  <span className="px-4 py-2 text-xs font-bold text-slate-400">
                    Página {paginaActual} de {cantidadPaginas}
                  </span>

                  <button
                    type="button"
                    disabled={paginaActual === cantidadPaginas}
                    onClick={() => setPaginaActual((pagina) => pagina + 1)}
                    aria-label="Ir a la página siguiente de reservas"
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
