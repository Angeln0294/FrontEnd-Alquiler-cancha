import { useEffect, useState } from "react";
import { useProductos } from "../context/ProductoContext";

export default function Tienda() {

  const {
    productos,
    categorias,
    cargando,
    cantidadProductos,
    paginaActual,
    limiteProductos,
    cargarProductos,
  } = useProductos();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("");

  // =========================
  // BUSCAR PRODUCTOS
  // =========================

  useEffect(() => {

    const tiempo = setTimeout(() => {
      cargarProductos(
        1,
        busqueda,
        limiteProductos
      );
    }, 400);

    return () => clearTimeout(tiempo);

  }, [busqueda]);

  // =========================
  // FILTRAR POR CATEGORÍA
  // =========================

  const productosFiltrados = productos.filter((producto) => {

    if (!categoriaSeleccionada) {
      return true;
    }

    return (
      producto.categoria?._id === categoriaSeleccionada
    );
  });

  // =========================
  // CAMBIAR PÁGINA
  // =========================

  const cambiarPagina = (pagina: number) => {

    cargarProductos(
      pagina,
      busqueda,
      limiteProductos
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // AGREGAR AL CARRITO
  // =========================

  const agregarAlCarrito = async (
    productoId: string
  ) => {

    try {

      const respuesta = await fetch(
        "http://localhost:3003/api/carrito",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            producto: productoId,
            cantidad: 1,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos?.mensaje ||
          "No se pudo agregar el producto al carrito"
        );
      }

      alert("Producto agregado al carrito 🛒");

    } catch (error) {

      console.error(
        "Error al agregar al carrito:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo agregar el producto al carrito"
      );
    }
  };

  // =========================
  // CANTIDAD DE PÁGINAS
  // =========================

  const cantidadPaginas = Math.ceil(
    cantidadProductos / limiteProductos
  );

  // =========================
  // RENDER
  // =========================

  return (

    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* ========================= */}
        {/* ENCABEZADO */}
        {/* ========================= */}

        <div className="mb-8">

          <h1 className="text-4xl font-black tracking-tight">
            Tienda 🛒
          </h1>

          <p className="text-slate-400 mt-2">
            Encontrá todo lo que necesitás para disfrutar de tu cancha.
          </p>

        </div>


        {/* ========================= */}
        {/* FILTROS */}
        {/* ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* BUSCADOR */}

          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Buscar producto
            </label>

            <input
              type="text"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Ej: pelota..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 outline-none focus:border-green-500 transition"
            />

          </div>


          {/* CATEGORÍA */}

          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Categoría
            </label>

            <select
              value={categoriaSeleccionada}
              onChange={(e) =>
                setCategoriaSeleccionada(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-green-500 transition"
            >

              <option value="">
                Todas las categorías
              </option>

              {categorias.map((categoria) => (

                <option
                  key={categoria._id}
                  value={categoria._id}
                >
                  {categoria.nombreCategoria}
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* ========================= */}
        {/* PRODUCTOS */}
        {/* ========================= */}

        {cargando ? (

          <div className="text-center py-20 text-slate-400">
            Cargando productos...
          </div>

        ) : productosFiltrados.length === 0 ? (

          <div className="text-center py-20">

            <div className="text-5xl mb-4">
              🔎
            </div>

            <h2 className="text-xl font-bold text-slate-200">
              No encontramos productos
            </h2>

            <p className="text-slate-500 mt-2">
              Probá con otro nombre o categoría.
            </p>

          </div>

        ) : (

          <>

            {/* ========================= */}
            {/* GRID DE CARDS */}
            {/* ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {productosFiltrados.map((producto) => (

                <div
                  key={producto._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-green-500/40 transition"
                >

                  {/* IMAGEN */}

                  <div className="h-56 bg-slate-950">

                    <img
                      src={producto.imagen}
                      alt={producto.nombreProducto}
                      className="w-full h-full object-cover"
                    />

                  </div>


                  {/* INFORMACIÓN */}

                  <div className="p-5">

                    <p className="text-xs text-purple-400 font-semibold mb-2">
                      {producto.categoria?.nombreCategoria}
                    </p>

                    <h2 className="text-lg font-bold text-slate-100">
                      {producto.nombreProducto}
                    </h2>

                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                      {producto.descripcion}
                    </p>


                    {/* PRECIO + BOTÓN */}

                    <div className="flex items-center justify-between gap-3 mt-5">

                      <span className="text-xl font-black text-green-400">
                        ${producto.precio}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          agregarAlCarrito(
                            producto._id
                          )
                        }
                        className="px-4 py-2.5 rounded-xl bg-green-500 text-slate-950 font-bold text-sm hover:bg-green-400 transition"
                      >
                        Agregar 🛒
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            {/* ========================= */}
            {/* PAGINACIÓN */}
            {/* ========================= */}

            {cantidadPaginas > 1 && (

              <div className="flex justify-center items-center gap-2 mt-10">

                {/* ANTERIOR */}

                <button
                  type="button"
                  disabled={paginaActual === 1}
                  onClick={() =>
                    cambiarPagina(
                      paginaActual - 1
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹
                </button>


                {/* NÚMEROS */}

                {Array.from(
                  { length: cantidadPaginas },
                  (_, index) => index + 1
                ).map((pagina) => (

                  <button
                    key={pagina}
                    type="button"
                    onClick={() =>
                      cambiarPagina(pagina)
                    }
                    className={`w-10 h-10 rounded-lg font-semibold transition ${
                      pagina === paginaActual
                        ? "bg-green-500 text-slate-950"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {pagina}
                  </button>

                ))}


                {/* SIGUIENTE */}

                <button
                  type="button"
                  disabled={
                    paginaActual === cantidadPaginas
                  }
                  onClick={() =>
                    cambiarPagina(
                      paginaActual + 1
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ›
                </button>

              </div>

            )}

          </>

        )}

      </div>

    </div>
  );
}