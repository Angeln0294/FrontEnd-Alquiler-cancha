import React, { createContext, useContext, useState } from "react";

interface TablaContextType {
  tablaCargando: boolean;
  setTablaCargando: (cargando: boolean) => void;
}

const TablaContext = createContext<TablaContextType | undefined>(undefined);

export const TablaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tablaCargando, setTablaCargando] = useState(false);

  return (
    <TablaContext.Provider value={{ tablaCargando, setTablaCargando }}>
      {children}
    </TablaContext.Provider>
  );
};

export const useTabla = () => {
  const context = useContext(TablaContext);
  if (!context) {
    throw new Error("useTabla debe usarse dentro de un TablaProvider");
  }
  return context;
};

