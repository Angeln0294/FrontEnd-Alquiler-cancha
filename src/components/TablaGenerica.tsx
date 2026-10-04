import React from "react";
import { useTabla } from "../context/TablaContext";

export interface Columna {
  id: string;
  titulo: string;
}

interface TablaGenericaProps<T> {
  columnas: Columna[];
  datos: T[];
  renderFila: (item: T) => React.ReactNode;
}

export function TablaGenerica<T>({ columnas, datos, renderFila }: TablaGenericaProps<T>) {
  const { tablaCargando } = useTabla();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-[#0b132b] min-h-75 relative">
      <table className="w-full min-w-225 text-left">
        <thead className="border-b border-slate-700 bg-[#111c36]">
          <tr>
            {columnas.map((col) => (
              <th key={col.id} className="px-5 py-4 text-sm font-semibold text-slate-300">
                {col.titulo}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tablaCargando ? (
            <tr>
              <td colSpan={columnas.length} className="px-5 py-20 text-center">
                <div className="w-10 h-10 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Cargando registros...</p>
              </td>
            </tr>
          ) : datos.length === 0 ? (
            <tr>
              <td colSpan={columnas.length} className="px-5 py-12 text-center text-sm text-slate-400">
                No se encontraron registros.
              </td>
            </tr>
          ) : (
            datos.map((item) => renderFila(item))
          )}
        </tbody>
      </table>
    </div>
  );
}
