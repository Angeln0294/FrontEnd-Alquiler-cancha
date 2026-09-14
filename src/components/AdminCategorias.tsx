import { useCategorias } from "../context/CategoriaContext";
import FormularioCategoriaAdmin from "./FormularioCategoriaAdmin";

export default function AdminCategorias() {
  const {
    categorias,
    cargando,
    modalAbierto,
    abrirCrear,
    abrirEditar,
    eliminarCategoria,
  } = useCategorias();

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
          onClick={abrirCrear}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl transition"
        >
          + Agregar categoría
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        {cargando ? (
          <div className="p-10 text-center text-slate-400">
            Cargando categorías...
          </div>
        ) : categorias.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No hay categorías registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                    Categoría
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>

                {categorias.map((categoria) => (
                  <tr
                    key={categoria._id}
                    className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                  >

                    <td className="px-6 py-4 text-slate-200">
                      {categoria.nombreCategoria}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        {/* EDITAR */}
                        <button
                          onClick={() => abrirEditar(categoria)}
                          className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
                          title="Editar categoría"
                        >
                          ✏️
                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() =>
                            eliminarCategoria(categoria._id)
                          }
                          className="px-3 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
                          title="Eliminar categoría"
                        >
                          🗑️
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* MODAL */}
      {modalAbierto && <FormularioCategoriaAdmin />}

    </div>
  );
}