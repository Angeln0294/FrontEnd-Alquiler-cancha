import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface UsuarioReserva {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
}

interface CanchaReserva {
  _id: string;
  nombre: string;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  precio: number;
}

interface Reserva {
  _id: string;
  usuario: UsuarioReserva;
  cancha: CanchaReserva;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
  estado: "pendiente" | "confirmada" | "cancelada";
  createdAt?: string;
}

const API_URL = "http://localhost:3003/api/reservas";

const swalTema = Swal.mixin({
  background: "#0b132b",
  color: "#ffffff",
  confirmButtonColor: "#22c55e",
  cancelButtonColor: "#475569",
  customClass: {
    popup: "border border-slate-700 rounded-2xl",
    title: "text-white",
    htmlContainer: "text-slate-400",
    confirmButton: "rounded-lg",
    cancelButton: "rounded-lg",
  },
});

export default function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);

  const [paginaActual, setPaginaActual] = useState(1);

  const reservasPorPagina = 5;

const totalPaginas = Math.ceil(reservas.length / reservasPorPagina);

const indiceInicio = (paginaActual - 1) * reservasPorPagina;
const indiceFin = indiceInicio + reservasPorPagina;

const reservasPagina = reservas.slice(indiceInicio, indiceFin);

  const cargarReservas = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(API_URL, {
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
      console.error("Error al cargar reservas:", error);

      await swalTema.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las reservas.",
        confirmButtonText: "Entendido",
        iconColor: "#ef4444",
      });
    } finally {
      setCargando(false);
    }
  };

 

  useEffect(() => {
    cargarReservas();
  }, []);

  const cambiarEstado = async (
    reserva: Reserva,
    nuevoEstado: "pendiente" | "confirmada" | "cancelada",
  ) => {
    if (reserva.estado === nuevoEstado) return;

    let titulo = "¿Cambiar estado?";
    let texto = "El estado de la reserva será actualizado.";
    let icono: "warning" | "success" = "warning";

    if (nuevoEstado === "confirmada") {
      titulo = "¿Confirmar reserva?";
      texto = "La reserva pasará a estar confirmada.";
      icono = "success";
    }

    if (nuevoEstado === "cancelada") {
      titulo = "¿Cancelar reserva?";
      texto = "La reserva será marcada como cancelada.";
    }

    const confirmacion = await swalTema.fire({
      icon: icono,
      title: titulo,
      text: texto,
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      iconColor: nuevoEstado === "cancelada" ? "#ef4444" : "#22c55e",
      confirmButtonColor: nuevoEstado === "cancelada" ? "#ef4444" : "#22c55e",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/${reserva._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          estado: nuevoEstado,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo actualizar el estado");
      }

      setReservas((reservasActuales) =>
        reservasActuales.map((r) =>
          r._id === reserva._id
            ? {
                ...r,
                estado: nuevoEstado,
              }
            : r,
        ),
      );

      await swalTema.fire({
        icon: "success",
        title: "Estado actualizado",
        text:
          resultado.mensaje ||
          "El estado de la reserva se actualizó correctamente.",
        confirmButtonText: "Continuar",
        iconColor: "#22c55e",
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);

      await swalTema.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el estado.",
        confirmButtonText: "Entendido",
        iconColor: "#ef4444",
      });

      await cargarReservas();
    }
  };

  const formatearFecha = (fecha: string) => {
    const fechaLocal = new Date(fecha);

    return fechaLocal.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const obtenerClaseEstado = (estado: Reserva["estado"]) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-500/10 border-green-500/20 text-green-400";

      case "cancelada":
        return "bg-rose-500/10 border-rose-500/20 text-rose-400";

      default:
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    }
  };

  const pendientes = reservas.filter(
    (reserva) => reserva.estado === "pendiente",
  ).length;

  const confirmadas = reservas.filter(
    (reserva) => reserva.estado === "confirmada",
  ).length;

  const canceladas = reservas.filter(
    (reserva) => reserva.estado === "cancelada",
  ).length;

  if (cargando) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-slate-400">Cargando reservas...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Gestión de reservas 📅
        </h1>

        <p className="mt-1 text-slate-400">
          Administra las reservas realizadas en Canchas Ya.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-xl border border-slate-700 bg-[#0b132b] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total reservas</p>

              <p className="mt-2 text-3xl font-bold text-white">
                {reservas.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl">
              📅
            </div>
          </div>
        </div>

        {/* PENDIENTES */}

        <div className="rounded-xl border border-yellow-500/20 bg-[#0b132b] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pendientes</p>

              <p className="mt-2 text-3xl font-bold text-yellow-400">
                {pendientes}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-xl">
              ⏳
            </div>
          </div>
        </div>

        {/* CONFIRMADAS */}

        <div className="rounded-xl border border-green-500/20 bg-[#0b132b] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Confirmadas</p>

              <p className="mt-2 text-3xl font-bold text-green-400">
                {confirmadas}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-xl">
              ✅
            </div>
          </div>
        </div>

        {/* CANCELADAS */}

        <div className="rounded-xl border border-rose-500/20 bg-[#0b132b] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Canceladas</p>

              <p className="mt-2 text-3xl font-bold text-rose-400">
                {canceladas}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-xl">
              ❌
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-[#0b132b]">
        <table className="w-full min-w-275 text-left">
          <thead className="border-b border-slate-700 bg-[#111c36]">
            <tr>
              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Usuario
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Cancha
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Fecha
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Horario
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Precio
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
  {reservas.length === 0 ? (
    <tr>
      <td colSpan={6} className="px-5 py-12 text-center">
        <div className="text-4xl">📅</div>

        <p className="mt-3 font-semibold text-white">
          No hay reservas registradas
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Las reservas realizadas aparecerán aquí.
        </p>
      </td>
    </tr>
  ) : (
    reservasPagina.map((reserva) => (
      <tr
        key={reserva._id}
        className="border-b border-slate-800 transition hover:bg-[#111c36]"
      >
        <td className="px-5 py-4">
          <div>
            <p className="font-medium text-white">
              {reserva.usuario.nombre} {reserva.usuario.apellido}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {reserva.usuario.email}
            </p>
          </div>
        </td>

        <td className="px-5 py-4">
          <p className="font-medium text-white">
            {reserva.cancha.nombre}
          </p>

          <p className="mt-1 text-xs text-green-400">
            {reserva.cancha.tipo}
          </p>
        </td>

        <td className="px-5 py-4 text-slate-300">
          {formatearFecha(reserva.fecha)}
        </td>

        <td className="px-5 py-4">
          <span className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white">
            {reserva.horaInicio} - {reserva.horaFin}
          </span>
        </td>

        <td className="px-5 py-4">
          <span className="font-bold text-green-400">
            ${reserva.precio.toLocaleString("es-AR")}
          </span>
        </td>

        <td className="px-5 py-4">
          <select
            value={reserva.estado}
            onChange={(e) =>
              cambiarEstado(
                reserva,
                e.target.value as Reserva["estado"],
              )
            }
            className={`rounded-lg border px-3 py-2 text-sm font-medium outline-none bg-[#0b132b] ${obtenerClaseEstado(
              reserva.estado,
            )}`}
          >
            <option
              value="pendiente"
              className="bg-[#0b132b] text-white"
            >
              Pendiente
            </option>

            <option
              value="confirmada"
              className="bg-[#0b132b] text-white"
            >
              Confirmada
            </option>

            <option
              value="cancelada"
              className="bg-[#0b132b] text-white"
            >
              Cancelada
            </option>
          </select>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>

      {totalPaginas > 1 && (
  <div className="flex items-center justify-between border-t border-slate-700 px-5 py-4">
    <button
      onClick={() => setPaginaActual((pagina) => pagina - 1)}
      disabled={paginaActual === 1}
      className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      ← Anterior
    </button>

    <div className="text-sm text-slate-400">
      Página{" "}
      <span className="font-semibold text-white">
        {paginaActual}
      </span>{" "}
      de{" "}
      <span className="font-semibold text-white">
        {totalPaginas}
      </span>
    </div>

    <button
      onClick={() => setPaginaActual((pagina) => pagina + 1)}
      disabled={paginaActual === totalPaginas}
      className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Siguiente →
    </button>
  </div>
)}
      </div>
    </div>
  );
}
