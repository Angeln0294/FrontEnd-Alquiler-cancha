import { useEffect, useState } from "react";

interface Categoria {
  _id: string;
  nombreCategoria: string;
}

interface Producto {
  _id: string;
  nombreProducto: string;
  precio: number;
  categoria: Categoria;
  imagen: string;
  descripcion: string;
}

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("");

  const [cargando, setCargando] = useState(true);


  const cargarCategorias = async () => {
    try {
      const respuesta = await fetch(
        "http://localhost:3003/api/categorias"
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las categorías");
      }

      const datos = await respuesta.json();

      setCategorias(datos);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const cargarProductos = async (termino = "") => {
    try {
      setCargando(true);

      let url =
        "http://localhost:3003/api/producto?pagina=1&limite=100";

      if (termino.trim() !== "") {
        url += `&termino=${encodeURIComponent(termino)}`;
      }

      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los productos");
      }

      const datos = await respuesta.json();

      setProductos(datos.productos);

    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);


  useEffect(() => {
    const tiempo = setTimeout(() => {
      cargarProductos(busqueda);
    }, 400);

    return () => clearTimeout(tiempo);
  }, [busqueda]);


  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <h1 className="text-4xl font-black tracking-tight">
            Tienda 🛒
          </h1>

          <p className="text-slate-400 mt-2">
            Encontrá todo lo que necesitás para disfrutar de tu cancha.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">


          
          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Categoría
            </label>

            <select
              value={categoriaSeleccionada}
              onChange={(e) =>
                setCategoriaSeleccionada(e.target.value)
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

          </div>

      </div>
  );
}