import type { JSX } from 'react'; 
import { Link } from 'react-router-dom';

export default function Footer(): JSX.Element { 
  return (
    <footer className="bg-[#0b132b] text-gray-400 border-t border-gray-800 pt-12 pb-6 px-6 md:px-12 w-full mt-auto z-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Columna 1: Info de la marca */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center font-bold text-xs text-white">
              ⚽
            </div>
            <span className="text-lg font-bold tracking-wide text-white">
              Canchas<span className="text-green-400">Ya</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed">
            La plataforma líder para reservar tus canchas de fútbol de forma rápida y sencilla. ¡Reúne a tu equipo y juega!
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegación</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li><Link to="/" className="hover:text-green-400 transition-colors no-underline text-gray-400">Inicio</Link></li>
            <li><a href="#canchas" className="hover:text-green-400 transition-colors">Nuestras Canchas</a></li>
            <li><a href="#tienda" className="hover:text-green-400 transition-colors">Tienda</a></li>
            <li><Link to="/contacto" className="hover:text-green-400 transition-colors no-underline text-gray-400">Contacto</Link></li>
          </ul>
        </div>

        {/* Columna 3: Horarios y Soporte */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Atención</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li>Todos los días: 08:00 - 23:00</li>
            <li>Soporte: info@canchasya.com</li>
            <li>Tel: +54 (11) 1234-5678</li>
          </ul>
        </div>

        {/* Columna 4: Redes Sociales */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Síguenos</h4>
          <div className="flex gap-3 text-xs">
            <a href="#facebook" className="bg-gray-800 hover:bg-green-500 hover:text-white px-3 py-2 rounded transition-all text-center">
              Facebook
            </a>
            <a href="#instagram" className="bg-gray-800 hover:bg-green-500 hover:text-white px-3 py-2 rounded transition-all text-center">
              Instagram
            </a>
          </div>
        </div>

      </div>

      {/* Barra de Derechos de Autor */}
      <div className="border-t border-gray-800 pt-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} CanchasYa. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <a href="#privacidad" className="hover:text-white transition-colors">Política de Privacidad</a>
          <a href="#terminos" className="hover:text-white transition-colors">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
}
