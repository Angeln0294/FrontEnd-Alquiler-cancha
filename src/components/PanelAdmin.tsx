import { useState } from "react";
import { Link } from "react-router-dom";
import AdminUsuarios from "./AdminUsuarios";
import AdminCanchas from "./AdminCanchas";
import AdminReservas from "./AdminReservas";
import AdminProductos from "./AdminProductos";

type Seccion =
  | "dashboard"
  | "usuarios"
  | "canchas"
  | "productos"
  | "categorias"
  | "reservas"
  | "configuracion";

export default function PanelAdmin() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [seccionActiva, setSeccionActiva] = useState<Seccion>("dashboard");

  const cambiarSeccion = (seccion: Seccion) => {
    setSeccionActiva(seccion);
    setMenuAbierto(false);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#030712] text-slate-100 flex font-sans selection:bg-green-500 selection:text-slate-950">
      {/* Overlay móvil con desenfoque */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* MENÚ LATERAL */}
      <aside
        className={`
          fixed md:static z-40 top-0 left-0
          h-full md:min-h-[calc(100vh-72px)] w-72
          bg-[#0b0f19]/90 backdrop-blur-xl
          border-r border-slate-800/60
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo moderno */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/60">
          <Link
            to="/"
            className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500 tracking-wider flex items-center gap-2.5 group"
            onClick={() => setMenuAbierto(false)}
          >
            <span className="p-2 rounded-xl bg-green-500/10 border border-green-500/20 group-hover:scale-105 transition-transform">
              ⚽
            </span>
            CANCHAS YA
          </Link>
        </div>

        {/* Navegación lateral */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Menú Principal
          </p>

          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "usuarios", label: "Usuarios", icon: "👥" },
            { id: "canchas", label: "Canchas", icon: "⚽" },
            { id: "productos", label: "Productos", icon: "🛒" },
            { id: "categorias", label: "Categorías", icon: "🏷️" },
            { id: "reservas", label: "Reservas", icon: "📅" },
            { id: "configuracion", label: "Configuración", icon: "⚙️" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium relative group ${
                seccionActiva === item.id
                  ? "bg-linear-to-r from-green-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-green-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
              onClick={() => cambiarSeccion(item.id as Seccion)}
            >
              <span className="text-base">{item.icon}</span>

              {item.label}

              {seccionActiva === item.id && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Perfil o Cerrar sesión */}
        <div className="p-4 border-t border-slate-800/60 bg-[#070a12]/50">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-medium text-sm border border-transparent hover:border-rose-500/20"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 min-w-0 bg-[#030712] overflow-x-hidden">
        {/* Header móvil */}
        <header className="md:hidden h-16 bg-[#0b0f19] border-b border-slate-800/60 flex items-center px-4 sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="text-xl text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            ☰
          </button>

          <span className="ml-4 font-bold text-sm tracking-wide">
            Panel de Administración
          </span>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* SECCIÓN USUARIOS */}
          {/* SECCIÓN USUARIOS */}
{seccionActiva === "usuarios" && <AdminUsuarios />}

{/* SECCIÓN CANCHAS */}
{seccionActiva === "canchas" && <AdminCanchas />}

{/* SECCIÓN PRODUCTOS */}
{seccionActiva === "productos" && <AdminProductos />}

{/* SECCIÓN RESERVAS */}
{seccionActiva === "reservas" && <AdminReservas />}

{seccionActiva !== "dashboard" &&
  seccionActiva !== "usuarios" &&
  seccionActiva !== "canchas" &&
  seccionActiva !== "productos" &&
  seccionActiva !== "reservas" && (
            <div className="bg-linear-to-br from-slate-900/80 to-[#0b0f19] border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
              <h1 className="text-3xl font-extrabold capitalize mb-2 tracking-tight">
                Gestión de {seccionActiva}
              </h1>

              <p className="text-slate-400 text-sm">
                Apartado dedicado al control y administración de {seccionActiva}
                .
              </p>
            </div>
          )}

          {/* SECCIÓN DASHBOARD CON GRÁFICAS */}
          {seccionActiva === "dashboard" && (
            <div className="space-y-8">
              {/* Encabezado */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                    Sistema Operativo Online
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                    Resumen General 📈
                  </h1>

                  <p className="text-slate-400 text-sm mt-1">
                    Métricas del rendimiento actual de Canchas Ya.
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
                    📅 Hoy: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* TARJETAS DE ESTADÍSTICAS MEJORADAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {[
                  {
                    title: "Usuarios",
                    count: "0",
                    icon: "👥",
                    change: "+0% este mes",
                    color: "from-blue-500/20 to-indigo-500/5",
                    border: "hover:border-blue-500/40",
                  },
                  {
                    title: "Canchas",
                    count: "0",
                    icon: "⚽",
                    change: "0 activas",
                    color: "from-green-500/20 to-emerald-500/5",
                    border: "hover:border-green-500/40",
                  },
                  {
                    title: "Reservas",
                    count: "0",
                    icon: "📅",
                    change: "0 pendientes",
                    color: "from-amber-500/20 to-orange-500/5",
                    border: "hover:border-amber-500/40",
                  },
                  {
                    title: "Productos",
                    count: "0",
                    icon: "🛒",
                    change: "Stock normal",
                    color: "from-purple-500/20 to-pink-500/5",
                    border: "hover:border-purple-500/40",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`bg-linear-to-b ${stat.color} bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 ${stat.border} shadow-xl shadow-black/40 group`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-slate-400 text-sm font-medium">
                        {stat.title}
                      </span>

                      <div className="w-11 h-11 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                    </div>

                    <div className="text-3xl font-black tracking-tight mb-2">
                      {stat.count}
                    </div>

                    <span className="text-xs text-slate-400 font-medium bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/50 inline-block">
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* SECCIÓN DE GRÁFICAS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfica de Barras Principal */}
                <div className="lg:col-span-2 bg-linear-to-b from-slate-900/90 to-[#0b0f19] border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-bold tracking-tight">
                          Actividad Semanal de Reservas
                        </h2>

                        <p className="text-xs text-slate-400">
                          Flujo de reservas durante los últimos 7 días
                        </p>
                      </div>

                      <span className="text-xs font-semibold px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                        Estadísticas
                      </span>
                    </div>

                    {/* Gráfica de Barras Visual */}
                    <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-800/60 pb-2">
                      {[
                        { day: "Lun", val: "15%" },
                        { day: "Mar", val: "30%" },
                        { day: "Mié", val: "45%" },
                        { day: "Jue", val: "25%" },
                        { day: "Vie", val: "70%" },
                        { day: "Sáb", val: "95%" },
                        { day: "Dom", val: "85%" },
                      ].map((bar, index) => (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                        >
                          <div
                            className="w-full max-w-9 bg-linear-to-t from-green-600 to-emerald-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-green-900/20 relative"
                            style={{ height: bar.val }}
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-green-400 whitespace-nowrap">
                              {bar.val}
                            </span>
                          </div>

                          <span className="text-[11px] font-medium text-slate-400">
                            {bar.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 text-xs text-slate-400 font-medium">
                    <span>Total semanal: 0 reservas</span>

                    <span className="text-green-400 font-bold">
                      ▲ 0% vs semana pasada
                    </span>
                  </div>
                </div>

                {/* Gráfica Circular / Barras de Progreso Secundarias */}
                <div className="bg-linear-to-b from-slate-900/90 to-[#0b0f19] border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight mb-1">
                      Estado de Canchas
                    </h2>

                    <p className="text-xs text-slate-400 mb-6">
                      Distribución por tipo o estado
                    </p>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-slate-300">
                            Canchas Sintéticas (F5)
                          </span>

                          <span className="text-green-400">0%</span>
                        </div>

                        <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
                          <div className="h-full bg-linear-to-r from-green-500 to-emerald-400 rounded-full w-[0%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-slate-300">
                            Canchas Techadas
                          </span>

                          <span className="text-blue-400">0%</span>
                        </div>

                        <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
                          <div className="h-full bg-linear-to-r from-blue-500 to-indigo-400 rounded-full w-[0%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-slate-300">
                            Canchas de Césped Natural
                          </span>

                          <span className="text-amber-400">0%</span>
                        </div>

                        <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
                          <div className="h-full bg-linear-to-r from-amber-500 to-orange-400 rounded-full w-[0%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800/60 mt-6">
                    <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💡</span>

                        <div>
                          <p className="text-xs font-bold text-slate-200">
                            Sugerencia
                          </p>

                          <p className="text-[11px] text-slate-400">
                            Registra tu primera cancha para ver métricas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVIDAD RECIENTE */}
              <div className="bg-linear-to-b from-slate-900/90 to-[#0b0f19] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">
                      Actividad reciente
                    </h2>

                    <p className="text-xs text-slate-400">
                      Últimos movimientos del sistema en tiempo real
                    </p>
                  </div>

                  <span
                    className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"
                    title="En vivo"
                  />
                </div>

                <div className="p-8">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-3xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                      📋
                    </div>

                    <p className="text-slate-200 font-semibold text-base">
                      No hay registros recientes todavía
                    </p>

                    <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto">
                      Las reservas, nuevos usuarios y transacciones que realicen
                      los clientes aparecerán listadas aquí automáticamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
