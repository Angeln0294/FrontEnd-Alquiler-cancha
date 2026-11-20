import { createContext, useContext, useEffect, useState } from "react";

import Swal from "sweetalert2";
import {
  obtenerCarritoService,
  agregarItemCarritoService,
  restarItemCarritoService,
  eliminarItemCarritoService,
  vaciarCarritoService,
} from "../services/carrito.service";
import { crearPreferenciaCarritoService } from "../services/pagos.service";
export interface ItemCarrito {
  producto: {
    _id: string;
    nombreProducto: string;
    precio: number;
    imagen: string;
    descripcion: string;
    categoria: {
      _id: string;
      nombreCategoria: string;
    };
  };
  cantidad: number;
}

export interface Carrito {
  _id: string;
  usuario: string;
  items: ItemCarrito[];
}

interface CarritoContextType {
  carrito: Carrito | null;
  cargando: boolean;
  agregarAlCarrito: (productoId: string, cantidad?: number) => Promise<void>;
  restarCantidad: (productoId: string) => Promise<void>;
  sumarCantidad: (productoId: string) => Promise<void>;
  eliminarProducto: (productoId: string) => Promise<void>;
  vaciarCarrito: () => Promise<void>;
  obtenerCarrito: () => Promise<void>;
  pagarCarrito: () => Promise<void>;
  cantidadTotal: number;
  precioTotal: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [cargando, setCargando] = useState(false);

  const obtenerCarrito = async () => {
    try {
      setCargando(true);

      const datos = await obtenerCarritoService();
      setCarrito(datos);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
    } finally {
      setCargando(false);
    }
  };

  const agregarAlCarrito = async (productoId: string, cantidad = 1) => {
    try {
      const datos = await agregarItemCarritoService(productoId, cantidad);
      setCarrito(datos.carrito);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo agregar el producto al carrito",
      });
    }
  };

  const restarCantidad = async (productoId: string) => {
    try {
      const datos = await restarItemCarritoService(productoId);
      setCarrito(datos.carrito);
    } catch (error) {
      console.error("Error al restar cantidad:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la cantidad",
      });
    }
  };

  const sumarCantidad = async (productoId: string) => {
    try {
      const datos = await agregarItemCarritoService(productoId, 1);

      setCarrito(datos.carrito);
    } catch (error) {
      console.error("Error al aumentar cantidad:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo aumentar la cantidad",
      });
    }
  };

  const eliminarProducto = async (productoId: string) => {
    try {
      await eliminarItemCarritoService(productoId);
      await obtenerCarrito();
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el producto",
      });
    }
  };

  const vaciarCarrito = async () => {
    try {
      await vaciarCarritoService();
      setCarrito((actual) => (actual ? { ...actual, items: [] } : null));
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo vaciar el carrito",
      });
    }
  };

  const pagarCarrito = async () => {
    try {
      const datos = await crearPreferenciaCarritoService();
      window.location.href = datos.init_point;
    } catch (error) {
      console.error("Error al iniciar el pago:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "No se pudo iniciar el pago",
      });
    }
  };

  useEffect(() => {
    obtenerCarrito();
  }, []);

  const cantidadTotal =
    carrito?.items
      .filter((item) => item.producto)
      .reduce((total, item) => total + item.cantidad, 0) || 0;

  const precioTotal =
    carrito?.items
      .filter((item) => item.producto)
      .reduce(
        (total, item) => total + item.producto.precio * item.cantidad,
        0,
      ) || 0;

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        cargando,
        agregarAlCarrito,
        restarCantidad,
        sumarCantidad,
        eliminarProducto,
        vaciarCarrito,
        obtenerCarrito,
        pagarCarrito,
        cantidadTotal,
        precioTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error("useCarrito debe utilizarse dentro de CarritoProvider");
  }

  return context;
}
