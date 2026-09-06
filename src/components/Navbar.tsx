import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

  return (
    <nav className="bg-[#0b132b] text-white px-6 py-4 md:px-12 flex flex-wrap items-center justify-between sticky top-0 z-50 shadow-md">
      
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer no-underline text-white">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-sm text-white">
          ⚽
        </div>
        <span className="text-xl font-bold tracking-wide">
          Canchas<span className="text-green-400">Ya</span>
        </span>
      </Link>

      {/* Menú de Hamburguesa (Celulares) */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white focus:outline-none cursor-pointer">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* Links de Navegación del Menú  */}
      <div className={`${isOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto mt-4 md:mt-0 transition-all duration-300`}>
        <ul className="flex flex-col md:flex-row gap-6 text-sm font-medium text-gray-300 md:items-center m-0 p-0 list-none">
          <li><Link to="/" className="hover:text-green-400 transition-colors no-underline text-gray-300">Inicio</Link></li>
          <li><Link to="/registro" className="hover:text-green-400 transition-colors no-underline text-gray-300">Registro</Link></li>
          <li><Link to="/canchas" className="hover:text-green-400 transition-colors no-underline text-gray-300">Nuestras Canchas</Link></li>
          <li><Link to="/tienda" className="hover:text-green-400 transition-colors no-underline text-gray-300">Tienda</Link></li>
          <li><Link to="/contacto" className="hover:text-green-400 transition-colors no-underline text-gray-300">Contacto</Link></li>
        </ul>
      </div>

      {/* Login y Cuenta */}
      <div className={`${isOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto mt-4 md:mt-0`}>
        <div className="flex items-center gap-4 text-sm justify-between md:justify-end">
          <Link to="/login" className="hover:text-green-400 transition-colors no-underline text-gray-300">
            Iniciar Sesión
          </Link>
          
          {/* Contenedor del Dropdown */}
          <div className="relative inline-block">
            <button 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all text-white focus:outline-none font-medium text-sm"
            >
              <span className="text-xs text-gray-400">Mi Cuenta</span>
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">👤</div>
            </button>

            {/* Menú Desplegable Flotante */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 text-left">
                <Link 
                  to="/perfil" 
                  className="block px-4 py-2 hover:bg-slate-700 text-sm text-gray-200 hover:text-green-400 transition no-underline"
                  onClick={() => setIsAccountOpen(false)}
                >
                  Mi Perfil
                </Link>
                <Link 
                  to="/mis-reservas" 
                  className="block px-4 py-2 hover:bg-slate-700 text-sm text-gray-200 hover:text-green-400 transition no-underline"
                  onClick={() => setIsAccountOpen(false)}
                >
                  Mis Reservas
                </Link>
                
                <hr className="border-slate-700 my-1" />
                
                <button 
                  onClick={() => { setIsAccountOpen(false); alert('Sesión cerrada de forma segura'); }}
                  className="w-full text-left px-4 py-2 hover:bg-red-900/30 text-red-400 text-sm transition font-medium focus:outline-none cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
