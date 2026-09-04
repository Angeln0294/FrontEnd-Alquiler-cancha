import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Registro from './components/Registro';

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0b132b]">
        {/* Manteniendo tu Navbar en la cabecera */}
        <Navbar />
        
        <Routes>
          {/* Ruta base del inicio */}
          <Route path="/" element={
            <main className="flex flex-col items-center justify-center text-white py-20 px-4">
              <h1 className="text-3xl md:text-5xl font-black text-center tracking-tight uppercase">
                RESERVA TU CANCHA <span className="text-green-400 block md:inline">FÁCILMENTE</span>
              </h1>
            </main>
          } />

          {/* Única ruta oficial de Registro dada de alta en TS */}
          <Route path="/registro" element={<Registro />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

