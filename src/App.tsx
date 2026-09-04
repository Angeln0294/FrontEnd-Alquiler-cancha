import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // <-- Importación limpia sin extensión .tsx

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0b132b]">
        {/* Añadimos el Navbar interactivo en la parte superior */}
        <Navbar />
        
        <Routes>
          {/* Ruta base temporal para verificar el funcionamiento del Navbar */}
          <Route path="/" element={
            <main className="flex flex-col items-center justify-center text-white py-20 px-4">
              <h1 className="text-3xl md:text-5xl font-black text-center tracking-tight uppercase">
                RESERVA TU CANCHA <span className="text-green-400 block md:inline">FÁCILMENTE</span>
              </h1>
              <p className="mt-4 text-gray-400 text-sm md:text-base max-w-md text-center font-medium">
                ¡Excelente! El Navbar de TypeScript está conectado y respondiendo sin errores de tipado.
              </p>
            </main>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
