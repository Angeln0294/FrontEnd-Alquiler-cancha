import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTabla } from "../context/TablaContext";
import { usePaginacionBackend } from "../context/PaginacionContext";
import {
  obtenerProductosService,
  obtenerTodasCategoriasService,
  actualizarProductoService,
  crearProductoService,
  eliminarProductoService,
} from "../services/productos.service";

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
  guardando: boolean;
  cantidadProductos: number;
  paginaActual: number;
  limiteProductos: number;
  cargarProductos: (
    pagina?: number,
    termino?: string,
    limite?: number,
  ) => Promise<void>;
  abrirCrear: () => void;
  abrirEditar: (producto: Producto) => void;
  cerrarModal: () => void;
  guardarProducto: (datosProducto: DatosProducto) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
}

const ProductoContext = createContext<ProductoContextType | undefined>(
  undefined,
);

export function ProductoProvider({ children }: { children: React.ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [limiteProductos] = useState(8);

  const { setTablaCargando } = useTabla();

  const { paginaActual, setCantidadPaginas } =
    usePaginacionBackend("productos");

  const cargarProductos = async (
    pagina = paginaActual || 1,
    termino = "",
    limite = limiteProductos,
  ) => {
    try {
      setTablaCargando(true);
      const numeroPagina = pagina || 1;

      const datos = await obtenerProductosService(
        numeroPagina,
        limite,
        termino,
      );

      setProductos(datos.productos || []);
      setCantidadProductos(datos.cantidadProductos || 0);

      const paginasTotales =
        datos.totalPaginas ||
        Math.ceil((datos.cantidadProductos || 0) / limite);
      setCantidadPaginas(paginasTotales);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos([]);
      setCantidadProductos(0);
    } finally {
      setTablaCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const datos = await obtenerTodasCategoriasService();

      setCategorias(datos.categorias || []);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategorias([]);
    }
  };

  useEffect(() => {
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

  const guardarProducto = async (datosProducto: DatosProducto) => {
    try {
      setGuardando(true);

      if (productoSeleccionado) {
        await actualizarProductoService(
          productoSeleccionado._id,
          datosProducto,
        );
      } else {
        await crearProductoService(datosProducto);
      }

      await cargarProductos();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      throw error;
    } finally {
      setGuardando(false);
    }
  };

  const eliminarProducto = async (id: string) => {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar producto?",
      text: "¿Estás seguro de que querés eliminar este producto?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    try {
      await eliminarProductoService(id);

      await cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el producto",
      });
    }
  };

  return (
    <ProductoContext.Provider
      value={{
        productos,
        categorias,
        productoSeleccionado,
        modalAbierto,
        guardando,
        cantidadProductos,
        paginaActual, // Ahora este valor se toma del contexto global e impacta en tus textos informativos
        limiteProductos,
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
    throw new Error("useProductos debe utilizarse dentro de ProductoProvider");
  }
  return context;
}
