import { createContext, useContext } from "react";

interface CanchasContextType {
  abrirFormularioEditar: (cancha: any) => void;
  eliminarCancha: (cancha: any) => void;
}

const CanchasContext = createContext<CanchasContextType | undefined>(undefined);

export const useCanchasAdmin = () => {
  const context = useContext(CanchasContext);
  if (!context) {
    throw new Error(
      "useCanchasAdmin debe usarse dentro de un CanchasContext.Provider",
    );
  }
  return context;
};

export default CanchasContext;
