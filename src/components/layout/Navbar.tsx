import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"

export default function Navbar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const accountButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isAccountOpen) return;

    const manejarEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
        accountButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [isAccountOpen]);

  const manejarCerrarSesion = async () => {
    setIsAccountOpen(false);
    setIsOpen(false);

    await cerrarSesion();

    navigate("/");
  };

  return (
    <nav className="bg-[#0b132b] text-white px-6 py-4 md:px-12 flex flex-wrap items-center justify-between sticky top-0 z-50 shadow-md">
      <Link
        to="/"
        className="flex items-center gap-2 cursor-pointer no-underline text-white"
        onClick={() => setIsOpen(false)}
      >
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-sm text-white">
          ⚽
        </div>

        <span className="text-xl font-bold tracking-wide">
          Canchas<span className="text-green-400">Ya</span>
        </span>
      </Link>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={
          isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
        }
        aria-expanded={isOpen}
        aria-controls="menu-navegacion"
        className="md:hidden text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div
        id="menu-navegacion"
        className={`${
          isOpen ? "block" : "hidden"
        } w-full md:flex md:items-center md:w-auto mt-4 md:mt-0`}
      >
        <ul className="flex flex-col md:flex-row gap-6 text-sm font-medium text-gray-300 md:items-center m-0 p-0 list-none">
          <li>
            <NavLink
              to="/"
              end
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors no-underline text-gray-300 focus-visible:outline-2 focus-visible:outline-green-400"
            >
              Inicio
            </NavLink>
          </li>

          {!usuario && (
            <li>
              <NavLink
                to="/registro"
                onClick={() => setIsOpen(false)}
                className="hover:text-green-400 transition-colors no-underline text-gray-300"
              >
                Registro
              </NavLink>
            </li>
          )}

          <li>
            <NavLink
              to="/canchas"
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors no-underline text-gray-300"
            >
              Nuestras Canchas
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/tienda"
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors no-underline text-gray-300"
            >
              Tienda
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contacto"
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors no-underline text-gray-300"
            >
              Contacto
            </NavLink>
          </li>
        </ul>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } w-full md:flex md:items-center md:w-auto mt-4 md:mt-0`}
      >
        <div className="flex flex-col md:flex-row items-center gap-3 text-sm justify-end">
          {/* Si NO hay usuario */}
          {!usuario && (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors no-underline text-gray-300"
            >
              Iniciar Sesión
            </Link>
          )}

          {usuario?.rol === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="bg-green-500 hover:bg-green-600 text-slate-950 px-4 py-2 rounded-lg font-bold transition-all no-underline shadow-lg shadow-green-500/20"
            >
              ⚙️ Panel Admin
            </Link>
          )}

          {usuario && (
            <div className="relative inline-block">
              <button
                ref={accountButtonRef}
                type="button"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                aria-expanded={isAccountOpen}
                aria-controls="menu-cuenta"
                aria-label="Mi cuenta"
                className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all text-white font-medium text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              >
                <span className="text-xs text-gray-300">Mi Cuenta</span>

                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-slate-950 font-bold">
                  {usuario.nombre?.charAt(0).toUpperCase()}
                </div>
              </button>

              {isAccountOpen && (
                <div
                  id="menu-cuenta"
                  className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 text-left"
                >
                  {/* Saludo */}
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-xs text-gray-400">Mi cuenta</p>

                    <p className="text-sm font-semibold text-white mt-1">
                      Hola, {usuario.nombre}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {usuario.email}
                    </p>
                  </div>

                  <Link
                    to="/perfil"
                    onClick={() => {
                      setIsAccountOpen(false);
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-slate-700 text-sm text-gray-200 hover:text-green-400 transition no-underline"
                  >
                    👤 Mi Perfil
                  </Link>
                  <Link
                    to="/mis-compras"
                    onClick={() => {
                      setIsAccountOpen(false);
                      setIsOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-slate-700 text-sm text-gray-200 hover:text-green-400 transition no-underline focus-visible:outline-2 focus-visible:outline-green-400"
                  >
                    🛍️ Mis compras
                  </Link>

                  {usuario?.rol !== "admin" && (
                    <Link
                      to="/mis-reservas"
                      onClick={() => {
                        setIsAccountOpen(false);
                        setIsOpen(false);
                      }}
                      className="block px-4 py-2 hover:bg-slate-700 text-sm text-gray-200 hover:text-green-400 transition no-underline"
                    >
                      📅 Mis Reservas
                    </Link>
                  )}

                  <hr className="border-slate-700 my-1" />

                  <button
                    onClick={manejarCerrarSesion}
                    className="w-full text-left px-4 py-2 hover:bg-red-900/30 text-red-400 text-sm transition font-medium focus:outline-none cursor-pointer"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
