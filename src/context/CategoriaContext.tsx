import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTabla } from "../context/TablaContext";
import { usePaginacionBackend } from "../context/PaginacionContext";

import Swal from "sweetalert2";
import { apiFetch } from "../services/api";

export interface Categoria {
  _id: string;
  nombreCategoria: string;
}

interface CategoriaContextType {
  todasLasCategorias: Categoria[];
  categorias: Categoria[];
  categoriaSeleccionada: Categoria | null;
  modalAbierto: boolean;
  guardando: boolean;
  limiteCategorias: number;
  obtenerCategorias: (page?: number) => Promise<void>;
  obtenerTodasLasCategorias: () => Promise<void>;
  abrirCrear: () => void;
  abrirEditar: (categoria: Categoria) => void;
  cerrarModal: () => void;
  guardarCategoria: (nombreCategoria: string) => Promise<void>;
  eliminarCategoria: (id: string) => Promise<void>;
}
const CategoriaContext = createContext<CategoriaContextType | undefined>(
  undefined,
);
export function CategoriaProvider({ children }: { children: React.ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [todasLasCategorias, setTodasLasCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [limiteCategorias] = useState(6);

  const { setTablaCargando } = useTabla();

  const { paginaActual, setCantidadPaginas } =
    usePaginacionBackend("categorias");

  const obtenerCategorias = async (pagina = paginaActual || 1) => {
    try {
      setTablaCargando(true);

      const numeroPagina = pagina || 1;

      const datos = await apiFetch<{
        categorias: Categoria[];
        paginacion?: {
          totalItems?: number;
          totalPages?: number;
        };
      }>(`/api/categorias?page=${numeroPagina}&limit=${limiteCategorias}`, {
        method: "GET",
      });

      setCategorias(datos.categorias || []);

      const totalItemsBackend =
        datos.paginacion?.totalItems || datos.categorias?.length || 0;

      const paginasTotales =
        datos.paginacion?.totalPages ||
        Math.ceil(totalItemsBackend / limiteCategorias) ||
        1;

      setCantidadPaginas(paginasTotales);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategorias([]);
    } finally {
      setTablaCargando(false);
    }
  };
 const obtenerTodasLasCategorias = useCallback(async () => {
  try {
    const datos = await apiFetch<{ categorias: Categoria[] }>(
      "/api/categorias/todas",
      { method: "GET" }
    );

    setTodasLasCategorias(datos.categorias || []);
  } catch (error) {
    console.error("Error al cargar todas las categorías:", error);
    setTodasLasCategorias([]);
  }
}, []);

  useEffect(() => {
    obtenerCategorias(1);
  }, []);

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

  const guardarCategoria = async (nombreCategoria: string) => {
    try {
      setGuardando(true);

      if (categoriaSeleccionada) {
        await apiFetch<void>(`/api/categorias/${categoriaSeleccionada._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombreCategoria }),
        });
      } else {
        await apiFetch<void>("/api/categorias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombreCategoria }),
        });
      }

      await obtenerCategorias();
      await obtenerTodasLasCategorias();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      await Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al guardar la categoría",
        confirmButtonText: "Aceptar",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setGuardando(false);
    }
  };

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
      await apiFetch<void>(`/api/categorias/${id}`, {
        method: "DELETE",
      });

      await obtenerCategorias();
      await obtenerTodasLasCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      await Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar la categoría",
        confirmButtonText: "Aceptar",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  return (
    <CategoriaContext.Provider
      value={{
        categorias,
        todasLasCategorias,
        categoriaSeleccionada,
        modalAbierto,
        guardando,
        limiteCategorias,
        obtenerTodasLasCategorias,
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

export function useCategorias() {
  const context = useContext(CategoriaContext);
  if (!context) {
    throw new Error(
      "useCategorias debe utilizarse dentro de CategoriaProvider",
    );
  }
  return context;
}
