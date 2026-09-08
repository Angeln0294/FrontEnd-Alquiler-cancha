import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 
import Login from "./components/Login";
import Registro from "./components/Registro";
import VerificarEmail from "./components/VerificarEmail";
import PanelAdmin from "./components/PanelAdmin";
import Contacto from "./components/Contacto"; 

export default function App() {
  return (
    <BrowserRouter>
      
      <div className="min-h-screen bg-[#0b132b] flex flex-col justify-between">
        
        
        <Navbar />

        
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
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </div>

        
        <Footer />
      </div>
    </BrowserRouter>
  );
}
