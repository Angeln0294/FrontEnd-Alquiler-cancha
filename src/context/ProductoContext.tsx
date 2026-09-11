import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Categoria {
  _id: string;
  nombreCategoria: string;
}

export interface Producto {
  _id: string;
  nombreProducto: string;
  precio: number;
  categoria: Categoria;
  imagen: string;
  descripcion: string;
}

interface DatosProducto {
  nombreProducto: string;
  precio: number;
  categoria: string;
  imagen: File | null;
  descripcion: string;
}

interface ProductoContextType {
  productos: Producto[];
  categorias: Categoria[];
  productoSeleccionado: Producto | null;

  modalAbierto: boolean;
  cargando: boolean;
  guardando: boolean;

  cargarProductos: () => Promise<void>;

  abrirCrear: () => void;
  abrirEditar: (producto: Producto) => void;
  cerrarModal: () => void;

  guardarProducto: (datosProducto: DatosProducto) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
}

const ProductoContext = createContext<ProductoContextType | undefined>(
  undefined
);

export function ProductoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(
        "http://localhost:3003/api/producto"
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los productos");
      }

      const datos = await respuesta.json();

      setProductos(datos.productos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const respuesta = await fetch(
        "http://localhost:3003/api/categorias"
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las categorías");
      }

      const datos = await respuesta.json();

      setCategorias(datos);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const abrirCrear = () => {
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirEditar = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  const guardarProducto = async (
    datosProducto: DatosProducto
  ) => {
    try {
    setGuardando(true);

    const formulario = new FormData();

    formulario.append(
      "nombreProducto",
      datosProducto.nombreProducto
    );

    formulario.append(
      "precio",
      String(datosProducto.precio)
    );

    formulario.append(
      "categoria",
      datosProducto.categoria
    );

    formulario.append(
      "descripcion",
      datosProducto.descripcion
    );

    // Solo agregamos imagen si seleccionó un archivo
    if (datosProducto.imagen) {
      formulario.append(
        "imagen",
        datosProducto.imagen
      );
    }

    let respuesta;

      // EDITAR
      if (productoSeleccionado) {
        respuesta = await fetch(
          `http://localhost:3003/api/producto/${productoSeleccionado._id}`,
          {
            method: "PUT",
            body: formulario,
            credentials: "include",
          }
        );
      }

      // CREAR
      else {
        respuesta = await fetch(
          "http://localhost:3003/api/producto",
          {
            method: "POST",
            body: formulario,
            credentials: "include",
          }
        );
      }

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => null);

        throw new Error(
          error?.mensaje ||
            error?.message ||
            "No se pudo guardar el producto"
        );
      }

      // Actualizamos la lista
      await cargarProductos();

      // Cerramos el modal
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar el producto"
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarProducto = async (id: string) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar este producto?"
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3003/api/producto/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el producto");
      }

      await cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <ProductoContext.Provider
      value={{
        productos,
        categorias,
        productoSeleccionado,

        modalAbierto,
        cargando,
        guardando,

        cargarProductos,

        abrirCrear,
        abrirEditar,
        cerrarModal,

        guardarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </ProductoContext.Provider>
  );
}

export function useProductos() {
  const context = useContext(ProductoContext);

  if (!context) {
    throw new Error(
      "useProductos debe utilizarse dentro de ProductoProvider"
    );
  }

  return context;
}