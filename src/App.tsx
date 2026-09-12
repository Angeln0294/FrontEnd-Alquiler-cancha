
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
import { ProductoProvider } from "./context/ProductoContext";
import MiPerfil from "./components/MiPerfil";
import Tienda from "./components/Tienda";
import NuestrasCanchas from "./components/NuestrasCanchas";
import ReservarTurnos from "./components/ReservarTurnos";
import CheckoutResultado from "./components/CheckoutResultado";
import MisReservas from "./components/MisReservas";
import ScrollToTop from "./components/ScrollToTop";
import Carrito from "./components/Carrito";
import ResultadoExitosMp from "./components/ResultadoExitosoMp";


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
              <Route path="/checkout/resultado" element={<ResultadoExitosMp />}/>
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

{/* CONTACTO */}
<Route
  path="/contacto"
  element={<Contacto />}
/>

{/* CANCHAS */}
<Route
  path="/reservas"
  element={<NuestrasCanchas />}
/>

<Route
  path="/canchas"
  element={<NuestrasCanchas />}
/>

<Route
  path="/nuestras-canchas"
  element={<NuestrasCanchas />}
/>

{/* RESERVAR TURNO */}
<Route
  path="/reservar-turnos"
  element={<ReservarTurnos />}
/>

{/* RUTA 404 - SIEMPRE AL FINAL */}
<Route
  path="*"
  element={<Error404 />}
/>
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
