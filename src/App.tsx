import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inicio from "./components/Inicio"; 
import Footer from "./components/Footer";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Contacto from "./components/Contacto";
import VerificarEmail from "./components/VerificarEmail";
import PanelAdmin from "./components/PanelAdmin";
import Error404 from "./components/Error404";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MiPerfil from "./components/MiPerfil";
import NuestrasCanchas from "./components/NuestrasCanchas";
import ReservarTurnos from "./components/ReservarTurnos"; 



export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 1. PADRE: Mantiene 'flex flex-col' para empujar el footer abajo */}
        <div className="min-h-screen bg-[#0b132b] flex flex-col justify-between">
          {/* 🟢 NAVBAR REAL interactivo para todo el sitio */}
          <Navbar />

          {/* 2. HIJO: Con 'grow' se estira ocupando el espacio del medio */}
          <div className="grow">
            <Routes>
              {/* 🟢 Renderiza la página de Inicio con el banner de anuncios y las 3 canchas */}
              <Route path="/" element={<Inicio />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/verificar-email" element={<VerificarEmail />} />
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <PanelAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <MiPerfil />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/reservas" element={<NuestrasCanchas />} />
              <Route path="/canchas" element={<NuestrasCanchas />} />
              <Route path="/nuestras-canchas" element={<NuestrasCanchas />} />
              <Route path="/reservar-turnos" element={<ReservarTurnos />} />
              {/* 🚨 RUTA COMODÍN: Es obligatorio que path="*" esté último en esta lista */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
