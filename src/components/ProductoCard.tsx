
import React from "react";

interface ProductoCardProps {
  producto: {
    _id: string;
    nombreProducto: string;
    imagen: string;
    precio: number;
    descripcion?: string;
    categoria?: {
      _id?: string;
      nombreCategoria: string;
    };
  };

  onAgregarAlCarrito: (
    producto: ProductoCardProps["producto"]
  ) => void | Promise<void>;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({
  producto,
  onAgregarAlCarrito,
}) => {
  return (
    <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
      {/* Imagen */}
      <div className="h-48 w-full bg-gray-900 overflow-hidden relative">
        <img
          src={producto.imagen}
          alt={producto.nombreProducto}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Información */}
      <div className="p-5 grow flex flex-col justify-between">
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
            {producto.categoria?.nombreCategoria ?? "Sin categoría"}
          </span>

          <h3 className="text-lg font-bold text-white mt-3 mb-2 truncate">
            {producto.nombreProducto}
          </h3>

          {producto.descripcion && (
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {producto.descripcion}
            </p>
          )}

          <p className="text-xl font-black text-green-400 mb-5">
            ${producto.precio.toLocaleString("es-AR")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAgregarAlCarrito(producto)}
          className="w-full bg-green-500 hover:bg-green-600 text-[#0b132b] font-black py-2.5 rounded-xl transition-colors text-sm tracking-wide shadow-md shadow-green-500/10 cursor-pointer"
        >
          AGREGAR 🛒
        </button>
      </div>
    </div>
  );
};
