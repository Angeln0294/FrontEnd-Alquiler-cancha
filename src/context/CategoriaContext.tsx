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

interface CategoriaContextType {
  categorias: Categoria[];
  categoriaSeleccionada: Categoria | null;
  modalAbierto: boolean;
  cargando: boolean;
  guardando: boolean;

  cargarCategorias: () => Promise<void>;
  abrirCrear: () => void;
  abrirEditar: (categoria: Categoria) => void;
  cerrarModal: () => void;
  guardarCategoria: (nombreCategoria: string) => Promise<void>;
  eliminarCategoria: (id: string) => Promise<void>;
}

const CategoriaContext = createContext<CategoriaContextType | undefined>(
  undefined
);

export function CategoriaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | null>(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Obtener todas las categorías
  const cargarCategorias = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(
        "http://localhost:3000/api/categorias"
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las categorías");
      }

      const datos = await respuesta.json();

      setCategorias(datos);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar categorías cuando se monta el Provider
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Abrir modal para crear
  const abrirCrear = () => {
    setCategoriaSeleccionada(null);
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirEditar = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
  };

  // Crear o editar categoría
  const guardarCategoria = async (nombreCategoria: string) => {
    try {
      setGuardando(true);

      let respuesta;

      // EDITAR
      if (categoriaSeleccionada) {
        respuesta = await fetch(
          `http://localhost:3000/api/categorias/${categoriaSeleccionada._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombreCategoria,
            }),
          }
        );
      }
      // CREAR
      else {
        respuesta = await fetch(
          "http://localhost:3000/api/categorias",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombreCategoria,
            }),
          }
        );
      }

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => null);

        throw new Error(
          error?.message ||
            error?.mensaje ||
            "No se pudo guardar la categoría"
        );
      }

      // Volvemos a cargar las categorías
      await cargarCategorias();

      // Cerramos el modal
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar categoría:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar la categoría"
      );
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar categoría
  const eliminarCategoria = async (id: string) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar esta categoría?"
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/categorias/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => null);

        throw new Error(
          error?.message ||
            error?.mensaje ||
            "No se pudo eliminar la categoría"
        );
      }

      await cargarCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la categoría"
      );
    }
  };

  return (
    <CategoriaContext.Provider
      value={{
        categorias,
        categoriaSeleccionada,
        modalAbierto,
        cargando,
        guardando,
        cargarCategorias,
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
      "useCategorias debe utilizarse dentro de CategoriaProvider"
    );
  }

  return context;
}