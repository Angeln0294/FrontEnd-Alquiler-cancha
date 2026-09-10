import { useEffect, useState } from "react";
import { useProductos } from "../context/ProductoContext";

export default function FormularioProductoAdmin() {
  const {
    productoSeleccionado,
    categorias,
    guardando,
    cerrarModal,
    guardarProducto,
  } = useProductos();

  const [nombreProducto, setNombreProducto] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // =========================
  // CARGAR DATOS AL EDITAR
  // =========================

  useEffect(() => {
    if (productoSeleccionado) {
      setNombreProducto(
        productoSeleccionado.nombreProducto
      );

      setPrecio(
        String(productoSeleccionado.precio)
      );

      setImagen(
        productoSeleccionado.imagen
      );

      setDescripcion(
        productoSeleccionado.descripcion
      );

      if (
        typeof productoSeleccionado.categoria === "object"
      ) {
        setCategoria(
          productoSeleccionado.categoria._id
        );
      } else {
        setCategoria(
          productoSeleccionado.categoria
        );
      }

    } else {
      // FORMULARIO VACÍO PARA CREAR
      setNombreProducto("");
      setPrecio("");
      setCategoria("");
      setImagen("");
      setDescripcion("");
    }
  }, [productoSeleccionado]);

  // =========================
  // SUBMIT
  // =========================

  const manejarSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const datosProducto = {
      nombreProducto,
      precio: Number(precio),
      categoria,
      imagen,
      descripcion,
    };

    await guardarProducto(datosProducto);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={cerrarModal}
    >

      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0b0f19] border border-slate-800 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="flex items-center justify-between p-6 border-b border-slate-800">

          <div>

            <h2 className="text-2xl font-black text-slate-100">

              {productoSeleccionado
                ? "Editar producto ✏️"
                : "Agregar producto 🛒"}

            </h2>

            <p className="text-sm text-slate-500 mt-1">

              {productoSeleccionado
                ? "Modificá los datos del producto."
                : "Completá los datos para registrar un nuevo producto."}

            </p>

          </div>

          <button
            type="button"
            onClick={cerrarModal}
            className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            ✕
          </button>

        </div>

        {/* FORMULARIO */}

        <form
          onSubmit={manejarSubmit}
          className="p-6 space-y-5"
        >

          {/* NOMBRE */}

          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Nombre del producto
            </label>

            <input
              type="text"
              value={nombreProducto}
              onChange={(e) =>
                setNombreProducto(e.target.value)
              }
              required
              minLength={2}
              placeholder="Ej: Pelota de fútbol"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 outline-none focus:border-green-500 transition"
            />

          </div>

          {/* PRECIO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Precio
              </label>

              <input
                type="number"
                value={precio}
                onChange={(e) =>
                  setPrecio(e.target.value)
                }
                required
                min="0"
                placeholder="Ej: 25000"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 outline-none focus:border-green-500 transition"
              />

            </div>

            <div />

          </div>

          {/* CATEGORIA */}

          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Categoría
            </label>

            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value)
              }
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-green-500 transition"
            >

              <option value="">
                Seleccionar categoría
              </option>

              {categorias.map((cat) => (

                <option
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.nombreCategoria}
                </option>

              ))}

            </select>

          </div>

          {/* IMAGEN */}

          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              URL de la imagen
            </label>

            <input
              type="url"
              value={imagen}
              onChange={(e) =>
                setImagen(e.target.value)
              }
              required
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 outline-none focus:border-green-500 transition"
            />

          </div>

          {/* PREVISUALIZACIÓN */}

          {imagen && (

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">

              <img
                src={imagen}
                alt="Vista previa"
                className="w-20 h-20 object-cover rounded-xl border border-slate-700"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div>

                <p className="text-sm font-semibold text-slate-300">
                  Vista previa
                </p>

                <p className="text-xs text-slate-500">
                  Así se verá la imagen del producto.
                </p>

              </div>

            </div>

          )}

          {/* DESCRIPCIÓN */}

          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              required
              rows={4}
              placeholder="Descripción del producto..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 outline-none focus:border-green-500 transition resize-none"
            />

          </div>

          {/* BOTONES */}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-800">

            <button
              type="button"
              onClick={cerrarModal}
              disabled={guardando}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-slate-950 font-bold hover:scale-[1.02] transition disabled:opacity-50 disabled:hover:scale-100"
            >

              {guardando
                ? "Guardando..."
                : productoSeleccionado
                ? "Guardar cambios"
                : "Crear producto"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}