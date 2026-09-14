import { useProductos } from "../context/ProductoContext";
import FormularioProductoAdmin from "./FormularioProductoAdmin";

export default function AdminProductos() {
  const {
    productos,
    cargando,
    modalAbierto,
    abrirCrear,
    abrirEditar,
    eliminarProducto,
    paginaActual,
    limiteProductos,
    cantidadProductos,
    cargarProductos,
  } = useProductos();

  const obtenerNombreCategoria = (
    categoria: string | { nombreCategoria: string },
  ): string => {
    if (typeof categoria === "object") {
      return categoria.nombreCategoria;
    }

    return categoria;
  };

  const obtenerImagen = (imagen: string) => {
    if (!imagen) {
      return "https://via.placeholder.com/80";
    }

    return imagen;
  };
  const cantidadPaginas = Math.ceil(cantidadProductos / limiteProductos);

  const cambiarPagina = (pagina: number) => {
    if (pagina < 1 || pagina > cantidadPaginas) return;

    cargarProductos(pagina);
  };

  // ================================
  // PAGINACIÓN
  // ================================

  const cantidadPaginas = Math.ceil(
    cantidadProductos / limiteProductos
  );

  const cambiarPagina = (pagina: number) => {
    if (pagina < 1 || pagina > cantidadPaginas) {
      return;
    }

    cargarProductos(pagina);
  };

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Gestión de Productos 🛒
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Administrá los productos disponibles para los clientes.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCrear}
          className="px-5 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-slate-950 font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-green-500/20"
        >
          + Agregar producto
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-linear-to-b from-slate-900/90 to-[#0b0f19] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
        {cargando ? (

          <div className="p-10 text-center text-slate-400">
            Cargando productos...
          </div>

        ) : productos.length === 0 ? (
          /* SIN PRODUCTOS */
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">🛒</div>

            <h2 className="text-lg font-bold text-slate-200">
              No hay productos
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Todavía no hay productos registrados.
            </p>

            <button
              type="button"
              onClick={abrirCrear}
              className="mt-5 px-5 py-2.5 rounded-xl bg-green-500 text-slate-950 font-bold text-sm hover:bg-green-400 transition"
            >
              Agregar primer producto
            </button>
          </div>
        ) : (
          /* TABLA DE PRODUCTOS */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40">
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Imagen
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Producto
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Precio
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Categoría
                  </th>

                  <th className="text-center px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => (
                  <tr
                    key={producto._id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition"
                  >
                    {/* IMAGEN */}
                    <td className="px-6 py-4">
                      <img
                        src={obtenerImagen(producto.imagen)}
                        alt={producto.nombreProducto}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-700"
                      />
                    </td>

                    {/* NOMBRE */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-200">
                        {producto.nombreProducto}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {producto.descripcion}
                      </p>
                    </td>

                    {/* PRECIO */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-400">
                        ${producto.precio}
                      </span>
                    </td>

                    {/* CATEGORIA */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                        {obtenerNombreCategoria(producto.categoria)}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {/* EDITAR */}
                        <button
                          type="button"
                          onClick={() => abrirEditar(producto)}
                          className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition"
                          title="Editar producto"
                        >
                          ✏️
                        </button>

                        {/* ELIMINAR */}
                        <button
                          type="button"
                          onClick={() => eliminarProducto(producto._id)}
                          className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                          title="Eliminar producto"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINACIÓN */}
            {cantidadPaginas > 1 && (
              <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
                {/* INFORMACIÓN */}
                <p className="text-sm text-slate-500">
                  Página {paginaActual} de {cantidadPaginas}
                </p>

                {/* BOTONES */}
                <div className="flex items-center gap-2">
                  {/* ANTERIOR */}
                  <button
                    type="button"
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 text-sm hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ←
                  </button>

                  {/* NÚMEROS */}
                  {Array.from(
                    { length: cantidadPaginas },
                    (_, indice) => indice + 1,
                  ).map((pagina) => (
                    <button
                      key={pagina}
                      type="button"
                      onClick={() => cambiarPagina(pagina)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                        paginaActual === pagina
                          ? "bg-green-500 text-slate-950"
                          : "border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {pagina}
                    </button>
                  ))}

                  {/* SIGUIENTE */}
                  <button
                    type="button"
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === cantidadPaginas}
                    className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 text-sm hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================================
          PAGINACIÓN
      ================================= */}

      {cantidadPaginas > 1 && (
        <div className="flex items-center justify-center gap-2">

          {/* ANTERIOR */}
          <button
            type="button"
            disabled={paginaActual === 1}
            onClick={() =>
              cambiarPagina(paginaActual - 1)
            }
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &lt;
          </button>

          {/* NÚMEROS */}
          {Array.from(
            { length: cantidadPaginas },
            (_, index) => index + 1
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

          {/* SIGUIENTE */}
          <button
            type="button"
            disabled={paginaActual === cantidadPaginas}
            onClick={() =>
              cambiarPagina(paginaActual + 1)
            }
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &gt;
          </button>

        </div>
      )}

      {/* INFORMACIÓN DE PRODUCTOS */}
      {cantidadProductos > 0 && (
        <p className="text-center text-xs text-slate-500">
          Mostrando{" "}
          {(paginaActual - 1) * limiteProductos + 1}{" "}
          -{" "}
          {Math.min(
            paginaActual * limiteProductos,
            cantidadProductos
          )}{" "}
          de {cantidadProductos} productos
        </p>
      )}

      {/* MODAL */}
      {modalAbierto && <FormularioProductoAdmin />}
    </div>
  );
}
