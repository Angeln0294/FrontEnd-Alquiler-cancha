import { useEffect, useState } from "react";
import { useProductos } from "../context/ProductoContext";
import { useCategorias } from "../context/CategoriaContext";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { usePaginacionBackend } from "../context/PaginacionContext";
import { PaginadorBackend } from "../components/ui/Paginador";
import { useNavigate } from "react-router-dom";
import { ProductoCard } from "../components/ui/ProductoCard";
import Swal from "sweetalert2";

export default function Tienda() {
  const { productos, cargarProductos, limiteProductos } = useProductos();
  const { paginaActual, cambiarPagina } = usePaginacionBackend("productos");
  const { categorias, obtenerTodasLasCategorias } = useCategorias();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { agregarAlCarrito, cantidadTotal } = useCarrito();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  useEffect(() => {
    if (paginaActual === 1) return;
    cargarProductos(paginaActual, busqueda, limiteProductos);
  }, [paginaActual]);

  useEffect(() => {
    obtenerTodasLasCategorias();
  }, [obtenerTodasLasCategorias]);

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

  const productosFiltrados = productos.filter((producto) => {
    if (!categoriaSeleccionada) return true;
    return producto.categoria?._id === categoriaSeleccionada;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
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
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-slate-950 font-bold hover:bg-green-400 transition shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            🛒 Ver carrito
            <span className="bg-slate-950 text-green-400 px-2 py-0.5 rounded-full text-sm">
              <span className="sr-only">Productos en el carrito: </span>
              {usuario ? cantidadTotal : 0}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" role="search" aria-label="Filtrar productos de la tienda">
          <div>
            <label htmlFor="buscar-producto" className="block text-sm font-semibold text-slate-300 mb-2">
              Buscar producto
            </label>
            <input
              id="buscar-producto"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: pelota..."
              aria-controls="resultados-productos"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 outline-none focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-400 transition"
            />
          </div>

          <div>
            <label htmlFor="filtrar-categoria" className="block text-sm font-semibold text-slate-300 mb-2">
              Categoría
            </label>
            <select
              id="filtrar-categoria"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              aria-controls="resultados-productos"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-green-500 focus-visible:ring-2 focus-visible:ring-green-400 transition"
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

        <section id="resultados-productos" aria-label="Resultados de productos">
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {productosFiltrados.length === 0
              ? "No encontramos productos con los filtros seleccionados."
              : `${productosFiltrados.length} productos mostrados en esta página.`}
          </p>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4" aria-hidden="true">🔎</div>
              <h2 className="text-xl font-bold text-slate-200">
                No encontramos productos
              </h2>
              <p className="text-slate-500 mt-2">
                Probá con otro nombre o categoría.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productosFiltrados.map((producto) => (
                  <ProductoCard
                    key={producto._id}
                    producto={producto}
                    onAgregarAlCarrito={async (productoSeleccionado) => {
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

                      await agregarAlCarrito(productoSeleccionado._id);

                      const resultado = await Swal.fire({
                        icon: "success",
                        title: "¡Producto agregado!",
                        text: `${productoSeleccionado.nombreProducto} fue agregado al carrito.`,
                        background: "#1e293b",
                        color: "#ffffff",
                        showCancelButton: true,
                        confirmButtonText: "🛒 Ver carrito",
                        cancelButtonText: "Seguir comprando",
                        confirmButtonColor: "#00d26a",
                        cancelButtonColor: "#00d26a",
                        reverseButtons: true,
                      });

                      if (resultado.isConfirmed) {
                        navigate("/carrito");
                      }
                    }}
                  />
                ))}
              </div>

              <div className="border-t border-slate-800 mt-8 pt-4">
                <PaginadorBackend seccion="productos" />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
