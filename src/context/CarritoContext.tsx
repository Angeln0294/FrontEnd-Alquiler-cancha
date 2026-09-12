import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ItemCarrito {
  producto: {
    _id: string;
    nombreProducto: string;
    precio: number;
    imagen: string;
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
  agregarAlCarrito: (
    productoId: string,
    cantidad?: number
  ) => Promise<void>;
  restarCantidad: (productoId: string) => Promise<void>;
  sumarCantidad: (productoId: string) => Promise<void>;
  eliminarProducto: (productoId: string) => Promise<void>;
  vaciarCarrito: () => Promise<void>;
  obtenerCarrito: () => Promise<void>;
  pagarCarrito: () => Promise<void>;
  cantidadTotal: number;
  precioTotal: number;
}

const CarritoContext = createContext<
  CarritoContextType | undefined
>(undefined);

export function CarritoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [cargando, setCargando] = useState(false);

  // =================================
  // OBTENER CARRITO
  // =================================

  const obtenerCarrito = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(
        "http://localhost:3003/api/carrito",
        {
          credentials: "include",
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo obtener el carrito");
      }

      const datos = await respuesta.json();

      setCarrito(datos);

    } catch (error) {
      console.error("Error al obtener carrito:", error);
    } finally {
      setCargando(false);
    }
  };

  // =================================
  // AGREGAR PRODUCTO
  // =================================

  const agregarAlCarrito = async (
    productoId: string,
    cantidad = 1
  ) => {
    try {
      const respuesta = await fetch(
        "http://localhost:3003/api/carrito",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            producto: productoId,
            cantidad,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos?.mensaje ||
            "No se pudo agregar el producto al carrito"
        );
      }

      setCarrito(datos.carrito);

    } catch (error) {
      console.error("Error al agregar al carrito:", error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo agregar el producto al carrito"
      );
    }
  };

  // =================================
  // RESTAR CANTIDAD
  // =================================

  const restarCantidad = async (
    productoId: string
  ) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3003/api/carrito/restar/${productoId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos?.mensaje ||
            "No se pudo actualizar la cantidad"
        );
      }

      setCarrito(datos.carrito);

    } catch (error) {
      console.error(
        "Error al restar cantidad:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la cantidad"
      );
    }
  };

  const sumarCantidad = async (productoId: string) => {
  try {
    const respuesta = await fetch(
      "http://localhost:3003/api/carrito",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          producto: productoId,
          cantidad: 1,
        }),
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos?.mensaje || "No se pudo aumentar la cantidad"
      );
    }

    setCarrito(datos.carrito);

  } catch (error) {
    console.error("Error al aumentar cantidad:", error);

    alert(
      error instanceof Error
        ? error.message
        : "No se pudo aumentar la cantidad"
    );
  }
};

  // =================================
  // ELIMINAR PRODUCTO
  // =================================

  const eliminarProducto = async (
    productoId: string
  ) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3003/api/carrito/producto/${productoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos?.mensaje ||
            "No se pudo eliminar el producto"
        );
      }

      await obtenerCarrito();

    } catch (error) {
      console.error(
        "Error al eliminar producto:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto"
      );
    }
  };

  // =================================
  // VACIAR CARRITO
  // =================================

  const vaciarCarrito = async () => {
    try {
      const respuesta = await fetch(
        "http://localhost:3003/api/carrito",
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos?.mensaje ||
            "No se pudo vaciar el carrito"
        );
      }

      setCarrito((actual) =>
        actual
          ? {
              ...actual,
              items: [],
            }
          : null
      );

    } catch (error) {
      console.error(
        "Error al vaciar carrito:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo vaciar el carrito"
      );
    }
  };

  const pagarCarrito = async () => {
  try {
    const respuesta = await fetch(
      "http://localhost:3003/api/pago/crear-preferencia",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos?.mensaje || "No se pudo iniciar el pago"
      );
    }

    window.location.href = datos.init_point;

  } catch (error) {
    console.error("Error al iniciar el pago:", error);

    alert(
      error instanceof Error
        ? error.message
        : "No se pudo iniciar el pago"
    );
  }
};

  // =================================
  // CARGAR CARRITO
  // =================================

  useEffect(() => {
    obtenerCarrito();
  }, []);

  // =================================
  // CANTIDAD TOTAL
  // =================================

  const cantidadTotal =
  carrito?.items
    .filter((item) => item.producto)
    .reduce(
      (total, item) =>
        total + item.cantidad,
      0
    ) || 0;

  // =================================
  // PRECIO TOTAL
  // =================================

  const precioTotal =
  carrito?.items
    .filter((item) => item.producto)
    .reduce(
      (total, item) =>
        total +
        item.producto.precio *
          item.cantidad,
      0
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
    throw new Error(
      "useCarrito debe utilizarse dentro de CarritoProvider"
    );
  }

  return context;
}