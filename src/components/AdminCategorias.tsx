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
    paginacion,
    obtenerCategorias,
  } = useCategorias();

  // Adaptamos las variables de tu diseño a los datos reales que vienen del contexto
  const cantidadPaginas = paginacion?.totalPages || 1;
  const paginaActual = paginacion?.currentPage || 1;
  const cambiarPagina = (numeroPagina: number) =>
    obtenerCategorias(numeroPagina);

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
        ) : !Array.isArray(categorias) || categorias.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No hay categorías registradas.
          </div>
        ) : (
          <>
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
                          <button
                            onClick={() => abrirEditar(categoria)}
                            className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
                            title="Editar categoría"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => eliminarCategoria(categoria._id)}
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

            {/* TU DISEÑO DE PAGINACIÓN CON ESTILO UNIFICADO */}
            {cantidadPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900/50 border-t border-slate-800">
                <button
                  type="button"
                  disabled={paginaActual === 1}
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>

                {Array.from(
                  { length: cantidadPaginas },
                  (_, index) => index + 1,
                ).map((pagina) => (
                  <button
                    key={pagina}
                    type="button"
                    onClick={() => cambiarPagina(pagina)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-semibold transition ${
                      paginaActual === pagina
                        ? "bg-green-500 border-green-500 text-slate-950"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
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
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {modalAbierto && <FormularioCategoriaAdmin />}
    </div>
  );
}
