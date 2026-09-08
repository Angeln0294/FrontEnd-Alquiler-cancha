
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminUsuarios from "./AdminUsuarios";

export default function PanelAdmin() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#0b132b] text-white flex">
      {/* Overlay para celular */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* MENÚ LATERAL */}
      <aside
        className={`
          fixed md:static z-40
          top-0 left-0
          h-full md:min-h-[calc(100vh-72px)]
          w-64
          bg-slate-900
          border-r border-slate-800
          transform transition-transform duration-300
          ${
            menuAbierto
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Link
            to="/"
            className="text-xl font-black text-green-400"
            onClick={() => setMenuAbierto(false)}
          >
            ⚽ CANCHAS YA
          </Link>
        </div>

        {/* Menú */}
        <nav className="p-4 space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider px-3 mb-3">
            Administración
          </p>

          {/* DASHBOARD */}
          <button
            type="button"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              seccionActiva === "dashboard"
                ? "bg-green-500 text-slate-950 font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            onClick={() => {
              setSeccionActiva("dashboard");
              setMenuAbierto(false);
            }}
          >
            <span>📊</span>
            Dashboard
          </button>

          {/* USUARIOS */}
          <button
            type="button"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              seccionActiva === "usuarios"
                ? "bg-green-500 text-slate-950 font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            onClick={() => {
              setSeccionActiva("usuarios");
              setMenuAbierto(false);
            }}
          >
            <span>👥</span>
            Usuarios
          </button>

          {/* CANCHAS */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
            onClick={() => setMenuAbierto(false)}
          >
            <span>⚽</span>
            Canchas
          </button>

          {/* PRODUCTOS */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
            onClick={() => setMenuAbierto(false)}
          >
            <span>🛒</span>
            Productos
          </button>

          {/* CATEGORÍAS */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
            onClick={() => setMenuAbierto(false)}
          >
            <span>🏷️</span>
            Categorías
          </button>

          {/* RESERVAS */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
            onClick={() => setMenuAbierto(false)}
          >
            <span>📅</span>
            Reservas
          </button>

          {/* CONFIGURACIÓN */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
            onClick={() => setMenuAbierto(false)}
          >
            <span>⚙️</span>
            Configuración
          </button>
        </nav>

      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 min-w-0">
        {/* Header móvil */}
        <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4">
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="text-2xl text-slate-300 hover:text-white"
          >
            ☰
          </button>

          <span className="ml-4 font-bold">Panel de Administración</span>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {/* SECCIÓN USUARIOS */}
          {seccionActiva === "usuarios" && <AdminUsuarios />}

          {/* SECCIÓN DASHBOARD */}
          {seccionActiva === "dashboard" && (
            <>
              {/* Encabezado */}
              <div className="mb-8">
                <p className="text-green-400 text-sm font-semibold uppercase tracking-wider">
                  Dashboard
                </p>

                <h1 className="text-3xl md:text-4xl font-black mt-1">
                  Panel de Administración
                </h1>

                <p className="text-slate-400 mt-2">
                  Bienvenido al panel de gestión de Canchas Ya.
                </p>
              </div>

              {/* TARJETAS DE ESTADÍSTICAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {/* Usuarios */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-sm">Usuarios</p>

                      <p className="text-3xl font-bold mt-2">0</p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center text-xl">
                      👥
                    </div>
                  </div>

                  <p className="text-green-400 text-xs mt-4">
                    Usuarios registrados
                  </p>
                </div>

                {/* Canchas */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-sm">Canchas</p>

                      <p className="text-3xl font-bold mt-2">0</p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center text-xl">
                      ⚽
                    </div>
                  </div>

                  <p className="text-green-400 text-xs mt-4">
                    Canchas registradas
                  </p>
                </div>

                {/* Reservas */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-sm">Reservas</p>

                      <p className="text-3xl font-bold mt-2">0</p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center text-xl">
                      📅
                    </div>
                  </div>

                  <p className="text-green-400 text-xs mt-4">
                    Reservas realizadas
                  </p>
                </div>

                {/* Productos */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-sm">Productos</p>

                      <p className="text-3xl font-bold mt-2">0</p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center text-xl">
                      🛒
                    </div>
                  </div>

                  <p className="text-green-400 text-xs mt-4">
                    Productos registrados
                  </p>
                </div>
              </div>

              {/* ACTIVIDAD RECIENTE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                  <h2 className="text-xl font-bold">Actividad reciente</h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Últimos movimientos del sistema.
                  </p>
                </div>

                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">📋</div>

                    <p className="text-slate-300 font-medium">
                      No hay actividad reciente
                    </p>

                    <p className="text-slate-500 text-sm mt-1">
                      Cuando haya movimientos aparecerán aquí.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

