import { useEffect, useState } from "react";
import { useProductos } from "../context/ProductoContext";
import { useCategorias } from "../context/CategoriaContext";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { usePaginacionBackend } from "../context/PaginacionContext";
import { PaginadorBackend } from "../components/Paginador";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Tienda() {
  const { productos, cargarProductos, limiteProductos } =
    useProductos();

  const { paginaActual, cambiarPagina } = usePaginacionBackend("productos");

  const { categorias, obtenerTodasLasCategorias, } = useCategorias();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { agregarAlCarrito, cantidadTotal } = useCarrito();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // CARGAR PRODUCTOS CUANDO CAMBIA LA PÁGINA
  // =====================================================
  useEffect(() => {
    cargarProductos(paginaActual, busqueda, limiteProductos);
  }, [paginaActual]);

  useEffect(() => { obtenerTodasLasCategorias(); }, [obtenerTodasLasCategorias]);

  // =====================================================
  // BUSCAR PRODUCTOS
  // =====================================================
  useEffect(() => {
    const tiempo = setTimeout(() => {
      // Si estamos en otra página, volvemos a la 1
      if (paginaActual !== 1) {
        cambiarPagina(1);
        return;
      }

      // Ya estamos en página 1 → hacemos la búsqueda
      cargarProductos(1, busqueda, limiteProductos);
    }, 400);

    return () => clearTimeout(tiempo);
  }, [busqueda]);

  // =====================================================
  // FILTRO POR CATEGORÍA
  // =====================================================
  const productosFiltrados = productos.filter((producto) => {
    if (!categoriaSeleccionada) return true;

    return producto.categoria?._id === categoriaSeleccionada;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* =====================================================
            ENCABEZADO
        ===================================================== */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Tienda 🛒</h1>

            <p className="text-slate-400 mt-2">
              Encontrá todo lo que necesitás para disfrutar de tu cancha.
            </p>
          </div>

          <button
            type="button"
            onClick={async () => {
              if (!usuario) {
                await Swal.fire({
                  icon: "warning",
                  title: "Iniciá sesión",
                  text: "Debés iniciar sesión para poder acceder al carrito.",
                  confirmButtonText: "Iniciar sesión",
                  background: "#1e293b",
                  color: "#f8fafc",
                  confirmButtonColor: "#22c55e",
                });

                navigate("/login");
                return;
              }

              navigate("/carrito");
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-slate-950 font-bold hover:bg-green-400 transition shrink-0"
          >
            🛒 Ver carrito
            <span className="bg-slate-950 text-green-400 px-2 py-0.5 rounded-full text-sm">
              {usuario ? cantidadTotal : 0}
            </span>
          </button>
        </div>

        {/* =====================================================
            FILTROS
        ===================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* BUSCADOR */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Buscar producto
            </label>

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
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
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-green-500 transition"
            >
              <option value="">Todas las categorías</option>

              {Array.isArray(categorias) &&
                categorias.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* =====================================================
            PRODUCTOS
        ===================================================== */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔎</div>

            <h2 className="text-xl font-bold text-slate-200">
              No encontramos productos
            </h2>

            <p className="text-slate-500 mt-2">
              Probá con otro nombre o categoría.
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE PRODUCTOS */}
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

                    <div className="flex items-center justify-between gap-3 mt-5">
                      <span className="text-xl font-black text-green-400">
                        ${producto.precio}
                      </span>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!usuario) {
                            await Swal.fire({
                              icon: "warning",
                              title: "Iniciá sesión",
                              text: "Debés iniciar sesión para agregar productos al carrito.",
                              confirmButtonText: "Iniciar sesión",
                              background: "#1e293b",
                              color: "#f8fafc",
                              confirmButtonColor: "#22c55e",
                            });

                            navigate("/login");
                            return;
                          }

                          await agregarAlCarrito(producto._id);

                          Swal.fire({
                            icon: "success",
                            title: "¡Producto agregado!",
                            text: `${producto.nombreProducto} fue agregado al carrito.`,
                            background: "#1e293b",
                            color: "#ffffff",
                            showCancelButton: true,
                            confirmButtonText: "🛒 Ver carrito",
                            cancelButtonText: "Seguir comprando",
                            confirmButtonColor: "#00d26a",
                            cancelButtonColor: "#00d26a",
                            reverseButtons: true,
                          }).then((resultado) => {
                            if (resultado.isConfirmed) {
                              navigate("/carrito");
                            }
                          });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-green-500 text-slate-950 font-bold text-sm hover:bg-green-400 transition"
                      >
                        Agregar 🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* =====================================================
                PAGINADOR BACKEND
            ===================================================== */}
            <div className="border-t border-slate-800 mt-8 pt-4">
              <PaginadorBackend seccion="productos" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
