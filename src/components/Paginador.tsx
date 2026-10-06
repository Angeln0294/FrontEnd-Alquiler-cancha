import React from "react";
import { usePaginacionBackend } from "../context/PaginacionContext";

interface PaginadorBackendProps {
  seccion: "canchas" | "productos" | "usuarios" | "reservas" | "categorias";
}

export const PaginadorBackend: React.FC<PaginadorBackendProps> = ({ seccion }) => {
  const { paginaActual, cantidadPaginas, cambiarPagina } = usePaginacionBackend(seccion);

  if (cantidadPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        type="button"
        disabled={paginaActual === 1}
        onClick={() => cambiarPagina(paginaActual - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      {Array.from({ length: cantidadPaginas }, (_, index) => index + 1).map((pagina) => (
        <button
          key={pagina}
          type="button"
          onClick={() => cambiarPagina(pagina)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-semibold transition ${
            paginaActual === pagina
              ? "bg-green-500 border-green-500 text-slate-950"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {pagina}
        </button>
      ))}

      <button
        type="button"
        disabled={paginaActual === cantidadPaginas}
        onClick={() => cambiarPagina(paginaActual + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
};
