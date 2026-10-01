import { createContext, useContext } from "react";

// 1. Definimos la interfaz estricta de las acciones
interface CanchasContextType {
  abrirFormularioEditar: (cancha: any) => void;
  eliminarCancha: (cancha: any) => void;
}

// 2. Creamos el contexto (por defecto undefined)
const CanchasContext = createContext<CanchasContextType | undefined>(undefined);

// 3. Hook personalizado para consumir las acciones desde las tarjetas
export const useCanchasAdmin = () => {
  const context = useContext(CanchasContext);
  if (!context) {
    throw new Error("useCanchasAdmin debe usarse dentro de un CanchasContext.Provider");
  }
  return context;
};

export default CanchasContext;
