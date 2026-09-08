import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 
import Login from "./components/Login";
import Registro from "./components/Registro";
import VerificarEmail from "./components/VerificarEmail";
import PanelAdmin from "./components/PanelAdmin";
import Contacto from "./components/Contacto"; 
import Tienda from "./components/Tienda"; 

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: string;
  imagen: string;
}

interface CartItem extends Producto {
  cantidad: number;
}

export default function App() {
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prevCart) => {
      const existe = prevCart.find((item) => item.id === producto.id);
      if (existe) {
        return prevCart.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCart, { ...producto, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (id: number, incremento: number) => {
    setCarrito((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + incremento } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0b132b] flex flex-col justify-between">
        <Navbar />

        <div className="grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificar-email" element={<VerificarEmail />} />
            <Route path="/admin" element={<PanelAdmin />} />
            <Route path="/contacto" element={<Contacto />} />
            
            <Route 
              path="/tienda" 
              element={
                <Tienda 
                  carrito={carrito} 
                  agregarAlCarrito={agregarAlCarrito} 
                  isCartOpen={isCartOpen}
                  setIsCartOpen={setIsCartOpen}
                  actualizarCantidad={actualizarCantidad}
                  eliminarDelCarrito={eliminarDelCarrito}
                />
              } 
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
