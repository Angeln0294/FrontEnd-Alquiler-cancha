import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTabla } from "../context/TablaContext";
import { usePaginacionBackend } from "../context/PaginacionContext"; // 1. IMPORTAMOS TU CONTEXTO GLOBAL

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
  const [limiteProductos] = useState(6);

  const { setTablaCargando } = useTabla();

  // 2. CONSUMIMOS LA PAGINACIÓN GLOBAL EN LUGAR DEL USE_STATE LOCAL
  const { paginaActual, setCantidadPaginas } =
    usePaginacionBackend("productos");

  // 3. LA FUNCIÓN TOMA POR DEFECTO LA PAGINA ACTUAL DEL CONTEXTO GLOBAL
  const cargarProductos = async (
    pagina = paginaActual || 1,
    termino = "",
    limite = limiteProductos,
  ) => {
    try {
      setTablaCargando(true);
      const numeroPagina = pagina || 1;
      let url =
        `${import.meta.env.VITE_BACKEND_URL}/api/producto` +
        `?pagina=${numeroPagina}` +
        `&limite=${limite}`;

      if (termino.trim() !== "") {
        url += `&termino=${encodeURIComponent(termino)}`;
      }

      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los productos");
      }

      const datos = await respuesta.json();

      setProductos(datos.productos || []);
      setCantidadProductos(datos.cantidadProductos || 0);

      // 4. LE AVISAMOS AL CONTEXTO LAS PÁGINAS TOTALES QUE DEVOLVIÓ TU SERVIDOR
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
      const respuesta = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/categorias`,
      );
      if (!respuesta.ok)
        throw new Error("No se pudieron obtener las categorías");
      const datos = await respuesta.json();
      setCategorias(datos);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    const paginaAAsignar = paginaActual || 1;

    cargarProductos(paginaAAsignar);
  }, [paginaActual]);

  // El useEffect de las categorías se ejecuta solo una vez al montar
  useEffect(() => {
    cargarCategorias();
  }, []);
  // ==========================================
  // MODALES (ABRIR Y CERRAR)
  // ==========================================
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

  // ==========================================
  // GUARDAR PRODUCTO (CREAR / EDITAR)
  // ==========================================
  const guardarProducto = async (datosProducto: DatosProducto) => {
    try {
      setGuardando(true);

      const formulario = new FormData();
      formulario.append("nombreProducto", datosProducto.nombreProducto);
      formulario.append("precio", String(datosProducto.precio));
      formulario.append("categoria", datosProducto.categoria);
      formulario.append("descripcion", datosProducto.descripcion);

      if (datosProducto.imagen) {
        formulario.append("imagen", datosProducto.imagen);
      }

      let respuesta;

      // EDITAR
      if (productoSeleccionado) {
        respuesta = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/producto/${productoSeleccionado._id}`,
          {
            method: "PUT",
            body: formulario,
            credentials: "include",
          },
        );
      }
      // CREAR
      else {
        respuesta = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/producto`,
          {
            method: "POST",
            body: formulario,
            credentials: "include",
          },
        );
      }

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => null);
        console.log("STATUS:", respuesta.status);
        console.log("ERROR DEL BACKEND:", error);

        let mensaje = `Error ${respuesta.status}`;

        if (Array.isArray(error)) {
          mensaje = error
            .map((item) => item.msg)
            .filter(Boolean)
            .join("\n");
        } else {
          mensaje = error?.message || error?.mensaje || error?.error || mensaje;
        }

        throw new Error(mensaje);
      }

      // Actualizamos la lista con la página actual
      await cargarProductos();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      throw error;
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================
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
      const respuesta = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/producto/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el producto");
      }

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

  // ==========================================
  // RENDERIZADO DEL PROVIDER
  // ==========================================
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
