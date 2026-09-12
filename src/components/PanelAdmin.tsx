import { useEffect, useState } from "react";

import AdminUsuarios from "./AdminUsuarios";
import AdminCanchas from "./AdminCanchas";
import AdminReservas from "./AdminReservas";
import AdminCategorias from "./AdminCategorias";
import AdminProductos from "./AdminProductos";

import { CategoriaProvider } from "../context/CategoriaContext";
import { useAuth } from "../context/AuthContext";

type Seccion =
  | "dashboard"
  | "usuarios"
  | "canchas"
  | "productos"
  | "categorias"
  | "reservas"
  | "configuracion";

interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: "usuario" | "admin";
  activo: boolean;
  emailVerificado: boolean;
}

interface Cancha {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  disponible: boolean;
}

interface Reserva {
  _id: string;
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  cancha: {
    _id: string;
    nombre: string;
    tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
    precio: number;
  };
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
  estado: "pendiente" | "confirmada" | "cancelada";
  createdAt?: string;
}

interface DatosDashboard {
  usuarios: Usuario[];
  canchas: Cancha[];
  reservas: Reserva[];
}

export default function PanelAdmin() {
  const { cerrarSesion } = useAuth();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] =
    useState<Seccion>("dashboard");

  const [datos, setDatos] = useState<DatosDashboard>({
    usuarios: [],
    canchas: [],
    reservas: [],
  });

  const [cargandoDashboard, setCargandoDashboard] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState(false);

  // ==========================================
  // CARGAR DATOS DEL DASHBOARD
  // ==========================================

  const cargarDatosDashboard = async () => {
    try {
      setCargandoDashboard(true);
      setErrorDashboard(false);

      const [respuestaUsuarios, respuestaCanchas, respuestaReservas] =
        await Promise.all([
          fetch("http://localhost:3003/api/usuario", {
            credentials: "include",
          }),

          fetch("http://localhost:3003/api/canchas", {
            credentials: "include",
          }),

          fetch("http://localhost:3003/api/reservas", {
            credentials: "include",
          }),
        ]);

      if (
        !respuestaUsuarios.ok ||
        !respuestaCanchas.ok ||
        !respuestaReservas.ok
      ) {
        throw new Error("No se pudieron obtener los datos del dashboard");
      }

      const resultadoUsuarios = await respuestaUsuarios.json();
      const resultadoCanchas = await respuestaCanchas.json();
      const resultadoReservas = await respuestaReservas.json();

      setDatos({
        usuarios: Array.isArray(resultadoUsuarios)
          ? resultadoUsuarios
          : [],

        canchas: resultadoCanchas.canchas || [],

        reservas: resultadoReservas.reservas || [],
      });
    } catch (error) {
      console.error(
        "Error al cargar datos del dashboard:",
        error
      );

      setErrorDashboard(true);
    } finally {
      setCargandoDashboard(false);
    }
  };

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  const totalUsuarios = datos.usuarios.length;

  const usuariosActivos = datos.usuarios.filter(
    (usuario) => usuario.activo
  ).length;

  const usuariosVerificados = datos.usuarios.filter(
    (usuario) => usuario.emailVerificado
  ).length;

  const administradores = datos.usuarios.filter(
    (usuario) => usuario.rol === "admin"
  ).length;

  const totalCanchas = datos.canchas.length;

  const canchasDisponibles = datos.canchas.filter(
    (cancha) => cancha.disponible
  ).length;

  const canchasNoDisponibles =
    totalCanchas - canchasDisponibles;

  const futbol5 = datos.canchas.filter(
    (cancha) => cancha.tipo === "Fútbol 5"
  ).length;

  const futbol7 = datos.canchas.filter(
    (cancha) => cancha.tipo === "Fútbol 7"
  ).length;

  const futbol11 = datos.canchas.filter(
    (cancha) => cancha.tipo === "Fútbol 11"
  ).length;

  const totalReservas = datos.reservas.length;

  const reservasPendientes = datos.reservas.filter(
    (reserva) => reserva.estado === "pendiente"
  ).length;

  const reservasConfirmadas = datos.reservas.filter(
    (reserva) => reserva.estado === "confirmada"
  ).length;

  const reservasCanceladas = datos.reservas.filter(
    (reserva) => reserva.estado === "cancelada"
  ).length;

  // ==========================================
  // RESERVAS DE LOS ÚLTIMOS 7 DÍAS
  // ==========================================

  const obtenerReservasUltimos7Dias = () => {
    const hoy = new Date();

    hoy.setHours(23, 59, 59, 999);

    const hace7Dias = new Date();

    hace7Dias.setDate(hace7Dias.getDate() - 6);
    hace7Dias.setHours(0, 0, 0, 0);

    return datos.reservas.filter((reserva) => {
      const fecha = new Date(reserva.fecha);

      return fecha >= hace7Dias && fecha <= hoy;
    });
  };

  const reservasUltimos7Dias =
    obtenerReservasUltimos7Dias();

  // ==========================================
  // DATOS PARA GRÁFICO SEMANAL
  // ==========================================

  const obtenerDatosSemana = () => {
    const hoy = new Date();

    return Array.from({ length: 7 }, (_, indice) => {
      const fecha = new Date(hoy);

      fecha.setDate(hoy.getDate() - (6 - indice));
      fecha.setHours(0, 0, 0, 0);

      const siguienteDia = new Date(fecha);

      siguienteDia.setDate(fecha.getDate() + 1);

      const cantidad = datos.reservas.filter((reserva) => {
        const fechaReserva = new Date(reserva.fecha);

        return (
          fechaReserva >= fecha &&
          fechaReserva < siguienteDia
        );
      }).length;

      return {
        fecha,
        cantidad,
        nombre: fecha.toLocaleDateString("es-AR", {
          weekday: "short",
        }),
      };
    });
  };

  const datosSemana = obtenerDatosSemana();

  const maxReservasSemana = Math.max(
    ...datosSemana.map((dia) => dia.cantidad),
    1
  );

  // ==========================================
  // RESERVAS RECIENTES
  // ==========================================

  const reservasRecientes = [...datos.reservas]
    .sort((a, b) => {
      const fechaA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : new Date(a.fecha).getTime();

      const fechaB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : new Date(b.fecha).getTime();

      return fechaB - fechaA;
    })
    .slice(0, 5);

  // ==========================================
  // FORMATEAR FECHA
  // ==========================================

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==========================================
  // CLASE ESTADO
  // ==========================================

  const obtenerClaseEstado = (
    estado: Reserva["estado"]
  ) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-500/10 border-green-500/20 text-green-400";

      case "cancelada":
        return "bg-rose-500/10 border-rose-500/20 text-rose-400";

      default:
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    }
  };

  // ==========================================
  // MENÚ
  // ==========================================

  const cambiarSeccion = (seccion: Seccion) => {
    setSeccionActiva(seccion);
    setMenuAbierto(false);
  };

  const menuItems = [
    {
      id: "dashboard" as Seccion,
      nombre: "Dashboard",
      icono: "📊",
    },
    {
      id: "usuarios" as Seccion,
      nombre: "Usuarios",
      icono: "👥",
    },
    {
      id: "canchas" as Seccion,
      nombre: "Canchas",
      icono: "⚽",
    },
    {
      id: "productos" as Seccion,
      nombre: "Productos",
      icono: "🛒",
    },
    {
      id: "categorias" as Seccion,
      nombre: "Categorías",
      icono: "🏷️",
    },
    {
      id: "reservas" as Seccion,
      nombre: "Reservas",
      icono: "📅",
    },
    {
      id: "configuracion" as Seccion,
      nombre: "Configuración",
      icono: "⚙️",
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="flex min-h-screen">

        {/* =====================================
            SIDEBAR
        ===================================== */}

        <aside
          className={`
            fixed left-0 top-0 z-50
            h-screen w-72
            border-r border-slate-800
            bg-[#0b0f19]
            transition-transform duration-300
            lg:translate-x-0
            ${
              menuAbierto
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* LOGO */}

          <div className="flex h-20 items-center border-b border-slate-800 px-6">
            <div>
              <p className="text-xl font-black">
                Canchas <span className="text-green-400">Ya</span>
              </p>

              <p className="text-xs text-slate-500">
                Panel de administración
              </p>
            </div>
          </div>

          {/* MENÚ */}

          <nav className="p-4">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Administración
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => cambiarSeccion(item.id)}
                  className={`
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-sm font-medium
                    transition
                    ${
                      seccionActiva === item.id
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg">
                    {item.icono}
                  </span>

                  {item.nombre}
                </button>
              ))}
            </div>
          </nav>

          {/* PARTE INFERIOR */}

          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
            <button
              type="button"
              onClick={cerrarSesion}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
            >
              <span>🚪</span>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* =====================================
            OVERLAY MOBILE
        ===================================== */}

        {menuAbierto && (
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuAbierto(false)}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          />
        )}

        {/* =====================================
            CONTENIDO PRINCIPAL
        ===================================== */}

        <main className="w-full lg:ml-72">

          {/* HEADER */}

          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-[#030712]/90 px-5 backdrop-blur-xl lg:px-8">

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMenuAbierto(!menuAbierto)
                }
                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-lg lg:hidden"
              >
                ☰
              </button>

              <div>
                <p className="text-xs text-slate-500">
                  Panel de administración
                </p>

                <h2 className="font-bold">
                  {menuItems.find(
                    (item) =>
                      item.id === seccionActiva
                  )?.nombre || "Dashboard"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={cargarDatosDashboard}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-green-500/30 hover:text-green-400"
            >
              🔄 Actualizar
            </button>
          </header>

          {/* CONTENIDO */}

          <div className="p-5 lg:p-8">

            {/* =================================
                DASHBOARD
            ================================= */}

            {seccionActiva === "dashboard" && (
              <div className="space-y-8">

                {/* TÍTULO */}

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                    Sistema activo
                  </div>

                  <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                    Resumen general 📈
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    Información actual de Canchas Ya.
                  </p>
                </div>

                {/* ERROR */}

                {errorDashboard && (
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
                    <p className="font-semibold text-rose-400">
                      No se pudieron cargar los datos.
                    </p>

                    <button
                      type="button"
                      onClick={cargarDatosDashboard}
                      className="mt-3 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
                    >
                      Reintentar
                    </button>
                  </div>
                )}

                {/* =================================
                    TARJETAS PRINCIPALES
                ================================= */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                  {/* USUARIOS */}

                  <div className="rounded-3xl border border-slate-800/80 bg-linear-to-b from-green-500/20 to-emerald-500/5 p-6 shadow-xl shadow-black/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          Usuarios
                        </p>

                        <p className="mt-2 text-4xl font-black">
                          {cargandoDashboard
                            ? "..."
                            : totalUsuarios}
                        </p>

                        <p className="mt-2 text-xs text-green-400">
                          {usuariosActivos} activos
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl">
                        👥
                      </div>
                    </div>
                  </div>

                  {/* CANCHAS */}

                  <div className="rounded-3xl border border-slate-800/80 bg-linear-to-b from-blue-500/20 to-indigo-500/5 p-6 shadow-xl shadow-black/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          Canchas
                        </p>

                        <p className="mt-2 text-4xl font-black">
                          {cargandoDashboard
                            ? "..."
                            : totalCanchas}
                        </p>

                        <p className="mt-2 text-xs text-blue-400">
                          {canchasDisponibles} disponibles
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl">
                        ⚽
                      </div>
                    </div>
                  </div>

                  {/* RESERVAS */}

                  <div className="rounded-3xl border border-slate-800/80 bg-linear-to-b from-yellow-500/20 to-orange-500/5 p-6 shadow-xl shadow-black/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          Reservas
                        </p>

                        <p className="mt-2 text-4xl font-black">
                          {cargandoDashboard
                            ? "..."
                            : totalReservas}
                        </p>

                        <p className="mt-2 text-xs text-yellow-400">
                          {reservasPendientes} pendientes
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl">
                        📅
                      </div>
                    </div>
                  </div>

                  {/* CONFIRMADAS */}

                  <div className="rounded-3xl border border-slate-800/80 bg-linear-to-b from-purple-500/20 to-violet-500/5 p-6 shadow-xl shadow-black/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          Confirmadas
                        </p>

                        <p className="mt-2 text-4xl font-black">
                          {cargandoDashboard
                            ? "..."
                            : reservasConfirmadas}
                        </p>

                        <p className="mt-2 text-xs text-purple-400">
                          Reservas confirmadas
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl">
                        ✅
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================
                    SEGUNDA FILA
                ================================= */}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                  {/* RESERVAS SEMANA */}

                  <div className="xl:col-span-2 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6">

                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-bold">
                          Reservas de los últimos 7 días
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Cantidad de reservas por día.
                        </p>
                      </div>

                      <span className="rounded-lg bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        {reservasUltimos7Dias.length} reservas
                      </span>
                    </div>

                    <div className="mt-8 flex h-64 items-end justify-between gap-3">

                      {datosSemana.map((dia) => {
                        const altura =
                          dia.cantidad === 0
                            ? 4
                            : Math.max(
                                (dia.cantidad /
                                  maxReservasSemana) *
                                  100,
                                8
                              );

                        return (
                          <div
                            key={dia.fecha.toISOString()}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                          >
                            <span className="text-xs font-semibold text-slate-300">
                              {dia.cantidad}
                            </span>

                            <div className="flex h-48 w-full items-end">
                              <div
                                className="w-full rounded-t-xl bg-linear-to-t from-green-600 to-green-400 transition-all"
                                style={{
                                  height: `${altura}%`,
                                }}
                              />
                            </div>

                            <span className="text-[11px] capitalize text-slate-500">
                              {dia.nombre.replace(".", "")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ESTADO RESERVAS */}

                  <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6">

                    <h2 className="text-lg font-bold">
                      Estado de reservas
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Distribución actual.
                    </p>

                    <div className="mt-8 space-y-6">

                      {/* PENDIENTES */}

                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-slate-300">
                            Pendientes
                          </span>

                          <span className="text-sm font-bold text-yellow-400">
                            {reservasPendientes}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-yellow-400"
                            style={{
                              width:
                                totalReservas > 0
                                  ? `${
                                      (reservasPendientes /
                                        totalReservas) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* CONFIRMADAS */}

                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-slate-300">
                            Confirmadas
                          </span>

                          <span className="text-sm font-bold text-green-400">
                            {reservasConfirmadas}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{
                              width:
                                totalReservas > 0
                                  ? `${
                                      (reservasConfirmadas /
                                        totalReservas) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* CANCELADAS */}

                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-slate-300">
                            Canceladas
                          </span>

                          <span className="text-sm font-bold text-rose-400">
                            {reservasCanceladas}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-rose-500"
                            style={{
                              width:
                                totalReservas > 0
                                  ? `${
                                      (reservasCanceladas /
                                        totalReservas) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* =================================
                    TERCERA FILA
                ================================= */}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                  {/* USUARIOS */}

                  <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6">

                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">
                          Usuarios
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Estado de las cuentas.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarSeccion("usuarios")
                        }
                        className="text-xs font-semibold text-green-400 hover:text-green-300"
                      >
                        Ver usuarios →
                      </button>
                    </div>

                    <div className="mt-6 space-y-5">

                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-slate-300">
                            Activos
                          </span>

                          <span className="text-sm font-bold text-green-400">
                            {usuariosActivos}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width:
                                totalUsuarios > 0
                                  ? `${
                                      (usuariosActivos /
                                        totalUsuarios) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-slate-300">
                            Email verificado
                          </span>

                          <span className="text-sm font-bold text-blue-400">
                            {usuariosVerificados}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{
                              width:
                                totalUsuarios > 0
                                  ? `${
                                      (usuariosVerificados /
                                        totalUsuarios) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                          <p className="text-xs text-slate-500">
                            Administradores
                          </p>

                          <p className="mt-1 text-2xl font-black text-purple-400">
                            {administradores}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                          <p className="text-xs text-slate-500">
                            Inactivos
                          </p>

                          <p className="mt-1 text-2xl font-black text-rose-400">
                            {totalUsuarios - usuariosActivos}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* CANCHAS */}

                  <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6">

                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">
                          Estado de canchas
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Distribución de las canchas registradas.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarSeccion("canchas")
                        }
                        className="text-xs font-semibold text-green-400 hover:text-green-300"
                      >
                        Ver canchas →
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                        <p className="text-xs text-slate-500">
                          Disponibles
                        </p>

                        <p className="mt-1 text-2xl font-black text-green-400">
                          {canchasDisponibles}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
                        <p className="text-xs text-slate-500">
                          No disponibles
                        </p>

                        <p className="mt-1 text-2xl font-black text-rose-400">
                          {canchasNoDisponibles}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 space-y-4">

                      <div className="flex items-center justify-between rounded-xl bg-slate-950/50 px-4 py-3">
                        <span className="text-sm text-slate-300">
                          ⚽ Fútbol 5
                        </span>

                        <span className="font-bold text-white">
                          {futbol5}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-950/50 px-4 py-3">
                        <span className="text-sm text-slate-300">
                          ⚽ Fútbol 7
                        </span>

                        <span className="font-bold text-white">
                          {futbol7}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-950/50 px-4 py-3">
                        <span className="text-sm text-slate-300">
                          ⚽ Fútbol 11
                        </span>

                        <span className="font-bold text-white">
                          {futbol11}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* =================================
                    ÚLTIMAS RESERVAS
                ================================= */}

                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70">

                  <div className="flex flex-col gap-3 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold">
                        Últimas reservas 📅
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Las reservas más recientes del sistema.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        cambiarSeccion("reservas")
                      }
                      className="text-sm font-semibold text-green-400 hover:text-green-300"
                    >
                      Ver todas →
                    </button>
                  </div>

                  {reservasRecientes.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="text-4xl">
                        📅
                      </div>

                      <p className="mt-3 font-semibold text-slate-300">
                        No hay reservas todavía
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Las reservas aparecerán aquí.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-187.5 text-left">

                        <thead className="border-b border-slate-800">
                          <tr>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Usuario
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Cancha
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Fecha
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Horario
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Estado
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {reservasRecientes.map(
                            (reserva) => (
                              <tr
                                key={reserva._id}
                                className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                              >
                                <td className="px-6 py-4">
                                  <p className="font-medium text-white">
                                    {
                                      reserva.usuario
                                        .nombre
                                    }{" "}
                                    {
                                      reserva.usuario
                                        .apellido
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {
                                      reserva.usuario
                                        .email
                                    }
                                  </p>
                                </td>

                                <td className="px-6 py-4">
                                  <p className="font-medium text-white">
                                    {
                                      reserva.cancha
                                        .nombre
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-green-400">
                                    {
                                      reserva.cancha
                                        .tipo
                                    }
                                  </p>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-300">
                                  {formatearFecha(
                                    reserva.fecha
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white">
                                    {
                                      reserva.horaInicio
                                    }{" "}
                                    -{" "}
                                    {reserva.horaFin}
                                  </span>
                                </td>

                                <td className="px-6 py-4">
                                  <span
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${obtenerClaseEstado(
                                      reserva.estado
                                    )}`}
                                  >
                                    {reserva.estado ===
                                    "confirmada"
                                      ? "Confirmada"
                                      : reserva.estado ===
                                        "cancelada"
                                      ? "Cancelada"
                                      : "Pendiente"}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>

                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* =================================
                USUARIOS
            ================================= */}

            {seccionActiva === "usuarios" && (
              <AdminUsuarios />
            )}

            {/* =================================
                CANCHAS
            ================================= */}

            {seccionActiva === "canchas" && (
              <AdminCanchas />
            )}

            {/* =================================
                CATEGORÍAS
            ================================= */}

            {seccionActiva === "categorias" && (
              <CategoriaProvider>
                <AdminCategorias />
              </CategoriaProvider>
            )}

            {/* =================================
                PRODUCTOS
            ================================= */}

            {seccionActiva === "productos" && (
              <AdminProductos />
            )}

            {/* =================================
                RESERVAS
            ================================= */}

            {seccionActiva === "reservas" && (
              <AdminReservas />
            )}

            {/* =================================
                CONFIGURACIÓN
            ================================= */}

            {seccionActiva === "configuracion" && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                <h1 className="text-2xl font-bold">
                  Configuración ⚙️
                </h1>

                <p className="mt-2 text-slate-400">
                  La sección de configuración estará disponible próximamente.
                </p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}