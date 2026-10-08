import React from "react";
import { useCanchasAdmin } from "../../../context/CanchasContext";

interface CanchaCardProps {
  cancha: {
    _id: string;
    nombre: string;
    imagen: string;
    tipo: string;
    disponible: boolean;
    descripcion: string;
    precio: number;
  };
}

export const CanchaCard: React.FC<CanchaCardProps> = ({ cancha }) => {
  // Consumimos las acciones sin usar props intermedias
  const { abrirFormularioEditar, eliminarCancha } = useCanchasAdmin();

  return (
    <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all group">
      <div className="h-48 bg-slate-800 overflow-hidden">
        <img
          src={cancha.imagen}
          alt={cancha.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-100">{cancha.nombre}</h3>
            <span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-semibold">
              {cancha.tipo}
            </span>
          </div>

          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
              cancha.disponible
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
          >
            {cancha.disponible ? "Disponible" : "No disponible"}
          </span>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 min-h-10">
          {cancha.descripcion}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <p className="text-xs text-slate-500">Precio</p>
          <p className="text-xl font-black text-green-400">
            ${cancha.precio.toLocaleString("es-AR")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            onClick={() => abrirFormularioEditar(cancha)}
            className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-sm font-semibold"
          >
            ✏️ Editar
          </button>

          <button
            type="button"
            onClick={() => eliminarCancha(cancha)}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition text-sm font-semibold"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
