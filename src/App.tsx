import { BrowserRouter, Routes, Route } from "react-router-dom";
// 🚀 Importamos tus componentes reales integrados en dev
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 
import Login from "./components/Login";
import Registro from "./components/Registro";
import VerificarEmail from "./components/VerificarEmail";
import PanelAdmin from "./components/PanelAdmin";
// ✉️ Importamos tu nueva página de Contacto
import Contacto from "./components/Contacto"; 

export default function App() {
  return (
    <BrowserRouter>
      {/* 1. PADRE: Mantiene 'flex flex-col' para ordenar el flujo vertical */}
      <div className="min-h-screen bg-[#0b132b] flex flex-col justify-between">
        
        {/* 🟢 NAVBAR REAL interactivo para todas las páginas */}
        <Navbar />

        {/* 2. HIJO: Con 'grow' se estira y empuja al Footer al fondo impecablemente */}
        <div className="grow">
          <Routes>
            <Route
              path="/"
              element={
                <main className="flex flex-col items-center justify-center text-white py-20 px-4">
                  <h1 className="text-3xl md:text-5xl font-black text-center tracking-tight uppercase">
                    RESERVA TU CANCHA{" "}
                    <span className="text-green-400 block md:inline">
                      FÁCILMENTE
                    </span>
                  </h1>
                </main>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificar-email" element={<VerificarEmail />} />
            <Route path="/admin" element={<PanelAdmin />} />
            
            {/* 🚀 Agregamos la ruta real para tu componente de Contacto */}
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </div>

        {/* 3. Tu Footer real firme abajo de todo */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
