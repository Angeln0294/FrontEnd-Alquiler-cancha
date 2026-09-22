import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./pages/Navbar";
import Inicio from "./components/Inicio";
import Footer from "./pages/Footer";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Contacto from "./pages/Contacto";
import VerificarEmail from "./components/VerificarEmail";
import PanelAdmin from "./components/PanelAdmin";
import Error404 from "./pages/Error404";
import { ProductoProvider } from "./context/ProductoContext";
import MiPerfil from "./pages/MiPerfil";
import Tienda from "./components/Tienda";
import NuestrasCanchas from "./components/NuestrasCanchas";
import ReservarTurnos from "./components/ReservarTurnos";
import MisReservas from "./components/MisReservas";
import ScrollToTop from "./components/ScrollToTop";
import Carrito from "./components/Carrito";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ResultadoExitosoMp from "./pages/ResultadoExitosoMp";
import CheckoutResultado from "./pages/CheckoutResultado";
import QuienesSomos from "./pages/QuienesSomos";
import MisCompras from "./components/MisCompras";

export default function App() {
  return (
    <AuthProvider>
      <ProductoProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-[#0b132b] flex flex-col justify-between">
            {/* NAVBAR */}
            <Navbar />

            {/* CONTENIDO PRINCIPAL */}
            <div className="grow">
              <Routes>
                {/* INICIO */}
                <Route path="/" element={<Inicio />} />

                {/* AUTENTICACIÓN */}
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/verificar-email" element={<VerificarEmail />} />
                <Route path="/tienda" element={<Tienda />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route
                  path="/checkout/resultado"
                  element={<ResultadoExitosoMp />}
                />

                <Route
                  path="/checkout/resultado-cancha"
                  element={<CheckoutResultado />}
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <PanelAdmin />
                    </ProtectedRoute>
                  }
                />

                {/* PERFIL */}
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <MiPerfil />
                    </ProtectedRoute>
                  }
                />

                {/* MIS RESERVAS */}
                <Route
                  path="/mis-reservas"
                  element={
                    <ProtectedRoute>
                      <MisReservas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mis-compras"
                  element={
                    <ProtectedRoute>
                      <MisCompras />
                    </ProtectedRoute>
                  }
                />

                {/* CONTACTO */}
                <Route path="/contacto" element={<Contacto />} />

                {/* CANCHAS */}
                <Route path="/reservas" element={<NuestrasCanchas />} />

                <Route path="/canchas" element={<NuestrasCanchas />} />

                <Route path="/nuestras-canchas" element={<NuestrasCanchas />} />

                {/* RESERVAR TURNO */}
                <Route path="/reservar-turnos" element={<ReservarTurnos />} />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                {/* RUTA 404 - SIEMPRE AL FINAL */}
                <Route path="*" element={<Error404 />} />
              </Routes>
            </div>

            {/* FOOTER */}
            <Footer />
          </div>
        </BrowserRouter>
      </ProductoProvider>
    </AuthProvider>
  );
}
