import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login'; // Tu componente de login refactorizado

// 🛠️ Navbar temporal para que compile la rama felizmente de forma aislada
const NavbarMock = () => (
  <nav className="p-4 bg-slate-900 border-b border-slate-800 text-white flex gap-4">
    <Link to="/" className="text-green-400 font-bold">Canchas Ya</Link>
    <Link to="/login" className="text-slate-300 hover:text-white">Iniciar Sesión</Link>
  </nav>
);

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0b132b]">
        {/* Usamos el componente temporal para evitar errores de importación */}
        <NavbarMock />
        
        <Routes>
          {/* Ruta base del inicio */}
          <Route path="/" element={
            <main className="flex flex-col items-center justify-center text-white py-20 px-4">
              <h1 className="text-3xl md:text-5xl font-black text-center tracking-tight uppercase">
                RESERVA TU CANCHA <span className="text-green-400 block md:inline">FÁCILMENTE</span>
              </h1>
            </main>
          } />

          {/* Única ruta oficial de Login en esta rama */}
          <Route path="/login" element={<Login />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}
