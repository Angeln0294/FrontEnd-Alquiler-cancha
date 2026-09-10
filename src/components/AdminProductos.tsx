import { useEffect, useState } from "react";

interface Categoria {
  _id: string;
  nombreCategoria: string;
}

interface Producto {
  _id: string;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: Categoria;
}

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch(
        "http://localhost:3003/api/producto?pagina=1&limite=100"
      );

      const data = await respuesta.json();

      setProductos(data.productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/categorias"
      );

      const data = await respuesta.json();

      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const crearProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCargando(true);

      const formData = new FormData();

      formData.append("nombreProducto", nombreProducto);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("categoria", categoria);

      if (imagen) {
        formData.append("imagen", imagen);
      }

      const respuesta = await fetch(
        "http://localhost:3003/api/producto",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.message || data.mensaje || "Error al crear producto");
      }

      alert("Producto creado correctamente");

      setNombreProducto("");
      setDescripcion("");
      setPrecio("");
      setCategoria("");
      setImagen(null);

      await obtenerProductos();

    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id: string) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar este producto?"
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3003/api/producto/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          data.message || data.mensaje || "No se pudo eliminar el producto"
        );
      }

      alert("Producto eliminado correctamente");

      await obtenerProductos();

    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="space-y-8">

      {/* TÍTULO */}
      <div>
        <h1 className="text-3xl font-black">
          Gestión de Productos 🛒
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Creá, editá y eliminá los productos de tu tienda.
        </p>
      </div>


      {/* FORMULARIO */}
      <div className="bg-linear-to-b from-slate-900/90 to-[#0b0f19] border border-slate-800/80 rounded-3xl p-6 shadow-2xl">

        <h2 className="text-xl font-bold mb-6">
          Agregar producto
        </h2>

        <form
          onSubmit={crearProducto}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* NOMBRE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre
            </label>

            <input
              type="text"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              placeholder="Ej: Pelota de fútbol"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-green-500"
              required
            />
          </div>


          {/* PRECIO */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Precio
            </label>

            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 25000"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-green-500"
              required
            />
          </div>


          {/* CATEGORÍA */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría
            </label>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-green-500"
              required
            >
              <option value="">
                Seleccioná una categoría
              </option>

              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombreCategoria}
                </option>
              ))}
            </select>
          </div>


          {/* IMAGEN */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imagen
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImagen(e.target.files?.[0] || null);
              }}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm"
            />
          </div>


          {/* DESCRIPCIÓN */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium mb-2">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del producto"
              rows={4}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-green-500"
              required
            />

          </div>


          {/* BOTÓN */}
          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-3 rounded-xl bg-green-500 text-slate-950 font-bold hover:bg-green-400 transition disabled:opacity-50"
            >
              {cargando ? "Creando..." : "Agregar producto"}
            </button>

          </div>

        </form>
      </div>


      {/* TABLA */}
      <div className="bg-linear-to-b from-slate-900/90 to-[#0b0f19] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">

        <div className="p-6 border-b border-slate-800">

          <h2 className="text-xl font-bold">
            Productos registrados
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            {productos.length} productos encontrados
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-950/70">

              <tr className="text-left text-xs uppercase tracking-wider text-slate-400">

                <th className="px-6 py-4">
                  Imagen
                </th>

                <th className="px-6 py-4">
                  Producto
                </th>

                <th className="px-6 py-4">
                  Precio
                </th>

                <th className="px-6 py-4">
                  Categoría
                </th>

                <th className="px-6 py-4">
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              {productos.map((producto) => (

                <tr
                  key={producto._id}
                  className="border-t border-slate-800 hover:bg-slate-800/30"
                >

                  {/* IMAGEN */}
                  <td className="px-6 py-4">

                    <img
                      src={producto.imagen}
                      alt={producto.nombreProducto}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-700"
                    />

                  </td>


                  {/* NOMBRE */}
                  <td className="px-6 py-4">

                    <p className="font-semibold">
                      {producto.nombreProducto}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {producto.descripcion}
                    </p>

                  </td>


                  {/* PRECIO */}
                  <td className="px-6 py-4">

                    <span className="text-green-400 font-bold">
                      ${producto.precio.toLocaleString("es-AR")}
                    </span>

                  </td>


                  {/* CATEGORÍA */}
                  <td className="px-6 py-4">

                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs">
                      {producto.categoria?.nombreCategoria || "Sin categoría"}
                    </span>

                  </td>


                  {/* ACCIONES */}
                  <td className="px-6 py-4">

                    <div className="flex gap-2">

                      <button
                        type="button"
                        className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarProducto(producto._id)}
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
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

      </div>

    </div>
  );
}