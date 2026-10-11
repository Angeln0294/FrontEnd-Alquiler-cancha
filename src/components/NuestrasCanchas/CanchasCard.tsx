import React from "react";

interface CanchaCardProps {
  cancha: {
    _id: string;
    nombre: string;
    imagen: string;
    tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
    disponible: boolean;
    descripcion: string;
    precio: number;
  };

  onReservar: (cancha: CanchaCardProps["cancha"]) => void;
}

export const CanchaCard: React.FC<CanchaCardProps> = ({
  cancha,
  onReservar,
}) => {
  return (
    <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
      
      {/* Imagen */}
      <div className="h-44 w-full bg-slate-900 overflow-hidden relative">
        <img
          src={cancha.imagen}
          alt={cancha.nombre}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Tipo de cancha */}
        <span className="absolute top-4 left-4 bg-[#0b132b]/90 text-green-400 text-xs font-bold px-3 py-1 rounded-lg border border-gray-800">
          {cancha.tipo}
        </span>

        {/* Disponibilidad */}
        {!cancha.disponible && (
          <span className="absolute top-4 right-4 bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-lg">
            No disponible
          </span>
        )}
      </div>

      {/* Información */}
      <div className="p-5 grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2">
            {cancha.nombre}
          </h3>

          <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
            {cancha.descripcion}
          </p>
        </div>

        {/* Precio y botón */}
        <div className="border-t border-gray-800/60 pt-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
              Precio por hora
            </span>

            <span className="text-lg font-black text-green-400">
              ${cancha.precio.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            type="button"
            disabled={!cancha.disponible}
            onClick={() => onReservar(cancha)}
            className="font-black px-5 py-2.5 rounded-xl text-xs bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-[#0b132b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {cancha.disponible ? "RESERVAR CANCHA" : "NO DISPONIBLE"}
          </button>
        </div>
      </div>
    </div>
  );
};
