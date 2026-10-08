import React, { createContext, useContext, useState } from "react";

// Definimos las secciones que usan paginación en tu app
type SeccionPaginada = "canchas" | "productos" | "usuarios" | "reservas" | "categorias";

interface EstadoPaginacion {
  paginaActual: number;
  cantidadPaginas: number;
}

interface PaginacionBackendContextType {
  paginaciones: Record<SeccionPaginada, EstadoPaginacion>;
  setCantidadPaginas: (seccion: SeccionPaginada, total: number) => void;
  cambiarPagina: (seccion: SeccionPaginada, nuevaPagina: number) => void;
}

const PaginacionBackendContext = createContext<PaginacionBackendContextType | undefined>(undefined);

export const PaginacionBackendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializamos cada sección en la página 1 y con 1 página total por defecto
  const [paginaciones, setPaginaciones] = useState<Record<SeccionPaginada, EstadoPaginacion>>({
    canchas: { paginaActual: 1, cantidadPaginas: 1 },
    productos: { paginaActual: 1, cantidadPaginas: 1 },
    usuarios: { paginaActual: 1, cantidadPaginas: 1 },
    reservas: { paginaActual: 1, cantidadPaginas: 1 },
    categorias: { paginaActual: 1, cantidadPaginas: 1 },
  });

  // Permite al backend actualizar cuántas páginas totales existen tras el fetch
  const setCantidadPaginas = (seccion: SeccionPaginada, total: number) => {
    setPaginaciones((prev) => ({
      ...prev,
      [seccion]: { ...prev[seccion], cantidadPaginas: total || 1 },
    }));
  };

  // Cambia la página activa de una sección específica
  const cambiarPagina = (seccion: SeccionPaginada, nuevaPagina: number) => {
    setPaginaciones((prev) => {
      const total = prev[seccion].cantidadPaginas;
      const paginaValidada = Math.max(1, Math.min(nuevaPagina, total));
      return {
        ...prev,
        [seccion]: { ...prev[seccion], paginaActual: paginaValidada },
      };
    });
  };

  return (
    <PaginacionBackendContext.Provider value={{ paginaciones, setCantidadPaginas, cambiarPagina }}>
      {children}
    </PaginacionBackendContext.Provider>
  );
};

// Hook personalizado para usarlo fácilmente
export const usePaginacionBackend = (seccion: SeccionPaginada) => {
  const context = useContext(PaginacionBackendContext);
  if (!context) {
    throw new Error("usePaginacionBackend debe usarse dentro de un PaginacionBackendProvider");
  }
  
  return {
    paginaActual: context.paginaciones[seccion].paginaActual,
    cantidadPaginas: context.paginaciones[seccion].cantidadPaginas,
    setCantidadPaginas: (total: number) => context.setCantidadPaginas(seccion, total),
    cambiarPagina: (nuevaPagina: number) => context.cambiarPagina(seccion, nuevaPagina),
  };
};
