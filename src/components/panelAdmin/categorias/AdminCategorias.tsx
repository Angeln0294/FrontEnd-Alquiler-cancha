import { useCategorias } from "../../../context/CategoriaContext";
import FormularioCategoriaAdmin from "../../FormularioCategoriaAdmin";
import { TablaGenerica, type Columna } from "../../TablaGenerica";
import { PaginadorBackend } from "../../Paginador";
import { usePaginacionBackend } from "../../../context/PaginacionContext"; // Corregida ruta al igual que los anteriores
import { useEffect } from "react";

const COLUMNAS_CATEGORIA: Columna[] = [
  { id: "categoria", titulo: "Categoría" },
  { id: "acciones", titulo: "Acciones" },
];

export default function AdminCategorias() {
  const {
    categorias,
    modalAbierto,
    
    abrirCrear,
    abrirEditar,
    eliminarCategoria,
    obtenerCategorias,
  } = useCategorias();

  // 1. Sincronizamos con el canal global de categorías
  const { paginaActual } = usePaginacionBackend("categorias");
 
 useEffect(() => {
  
  obtenerCategorias(paginaActual || 1);
}, [paginaActual]);


  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Gestión de Categorías 🏷️
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Administrá las categorías disponibles para los productos.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCrear}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl transition"
        >
          + Agregar categoría
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
         
          <div className="overflow-x-auto">
            <TablaGenerica
              columnas={COLUMNAS_CATEGORIA}
              datos={categorias}
              renderFila={(categoria) => ( // 2. CORREGIDO: Parámetro en singular para coincidir con las celdas
                <tr
                  key={categoria._id}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4 text-slate-200">
                    {categoria.nombreCategoria}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEditar(categoria)}
                        className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
                        title="Editar categoría"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarCategoria(categoria._id)}
                        className="px-3 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
                        title="Eliminar categoría"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />

            <div className="border-t border-slate-800 p-4">
              <PaginadorBackend seccion="categorias" />
            </div>
          </div>
      
      </div>

      {/* MODAL */}
      {modalAbierto && <FormularioCategoriaAdmin />}
    </div>
  );
}
