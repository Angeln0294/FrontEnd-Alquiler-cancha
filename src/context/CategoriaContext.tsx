import { createContext, useContext, useState } from "react";
import { useTabla } from "../context/TablaContext";
import { usePaginacionBackend } from "../context/PaginacionContext"; // Importación oficial corregida
import Swal from "sweetalert2";

export interface Categoria {
  _id: string;
  nombreCategoria: string;
}

interface CategoriaContextType {
  categorias: Categoria[];
  categoriaSeleccionada: Categoria | null;
  modalAbierto: boolean;
  guardando: boolean;
  limiteCategorias: number;
  obtenerCategorias: (page?: number) => Promise<void>;
  abrirCrear: () => void;
  abrirEditar: (categoria: Categoria) => void;
  cerrarModal: () => void;
  guardarCategoria: (nombreCategoria: string) => Promise<void>;
  eliminarCategoria: (id: string) => Promise<void>;
}

const CategoriaContext = createContext<CategoriaContextType | undefined>(undefined);

export function CategoriaProvider({ children }: { children: React.ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [limiteCategorias] = useState(6);
 
  const { setTablaCargando } = useTabla();
 
  // 1. CONSUMIMOS LA PAGINACIÓN GLOBAL EN LUGAR DE ESTADOS LOCALES DE PAGINACIÓN
  const { paginaActual, setCantidadPaginas } = usePaginacionBackend("categorias");
 
  const obtenerCategorias = async (pagina = paginaActual || 1) => {
    try {
      setTablaCargando(true);
      const numeroPagina = pagina || 1;
      
      // Enviamos las queries correctas en inglés de acuerdo a tu API
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/categorias?page=${numeroPagina}&limit=${limiteCategorias}`;

      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las categorías");
      }

      const datos = await respuesta.json();

      // Guardamos la lista de categorías extraídas del backend
      setCategorias(datos.categorias || []);

      // 🚀 ADAPTACIÓN AL FORMATO DE TU BACKEND:
      // Tu API devuelve 'datos.paginacion.totalPages'. Si por algún motivo viniera vacío,
      // usamos el 'totalItems' dividido por el límite para que nunca falle la interfaz.
      const totalItemsBackend = datos.paginacion?.totalItems || datos.categorias?.length || 0;
      const paginasTotales = datos.paginacion?.totalPages || Math.ceil(totalItemsBackend / limiteCategorias) || 1;
      
      // Le inyectamos el total real de páginas (un 2) al mismo hook global que usan productos y canchas
      setCantidadPaginas(paginasTotales);
      
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategorias([]);
    } finally {
      setTablaCargando(false);
    }
  };


  // CÓDIGO CORREGIDO: El contexto NO dispara la carga automática para no pisarse con la vista.
  // Dejamos que AdminCategorias maneje el llamado cuando el usuario entra a la pestaña.
  // ==========================================
  // MODALES (ABRIR Y CERRAR)
  // ==========================================
  const abrirCrear = () => {
    setCategoriaSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirEditar = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
  };

  // ==========================================
  // CREAR O EDITAR CATEGORÍA
  // ==========================================
  const guardarCategoria = async (nombreCategoria: string) => {
    try {
      setGuardando(true);
      let respuesta;

      // EDITAR
      if (categoriaSeleccionada) {
        respuesta = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/categorias/${categoriaSeleccionada._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ nombreCategoria }),
          },
        );
      }
      // CREAR
      else {
        respuesta = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/categorias`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ nombreCategoria }),
          },
        );
      }

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => null);
        console.log("ERROR DEL BACKEND:", error);
        throw new Error(
          error?.message ||
            error?.mensaje ||
            error?.errors?.[0]?.msg ||
            "No se pudo guardar la categoría",
        );
      }

      // Volvemos a cargar las categorías con el paginado actual
      await obtenerCategorias();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      await Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: error instanceof Error ? error.message : "Ocurrió un error al guardar la categoría",
        confirmButtonText: "Aceptar",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // ELIMINAR CATEGORÍA
  // ==========================================
  const eliminarCategoria = async (id: string) => {
    const confirmar = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!confirmar.isConfirmed) return;

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/categorias/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => null);
        throw new Error(error?.message || error?.mensaje || "No se pudo eliminar la categoría");
      }

      await obtenerCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      await Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error instanceof Error ? error.message : "No se pudo eliminar la categoría",
        confirmButtonText: "Aceptar",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  // ==========================================
  // PROVIDER VALUE INJECTION
  // ==========================================
  return (
    <CategoriaContext.Provider
      value={{
        categorias,
        categoriaSeleccionada,
        modalAbierto,
        guardando,
        limiteCategorias,
        obtenerCategorias,
        abrirCrear,
        abrirEditar,
        cerrarModal,
        guardarCategoria,
        eliminarCategoria,
      }}
    >
      {children}
    </CategoriaContext.Provider>
  );
}

// ==========================================
  // HOOK DE CONSUMO PERSONALIZADO
  // ==========================================
export function useCategorias() {
  const context = useContext(CategoriaContext);
  if (!context) {
    throw new Error("useCategorias debe utilizarse dentro de CategoriaProvider");
  }
  return context;
}
