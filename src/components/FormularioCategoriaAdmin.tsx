import { useEffect, useState } from "react";
import { useCategorias } from "../context/CategoriaContext";

export default function FormularioCategoriaAdmin() {
  const {
    categoriaSeleccionada,
    guardando,
    cerrarModal,
    guardarCategoria,
  } = useCategorias();

  const [nombreCategoria, setNombreCategoria] = useState("");

  // Cargar los datos cuando estamos editando
  useEffect(() => {
    if (categoriaSeleccionada) {
      setNombreCategoria(categoriaSeleccionada.nombreCategoria);
    } else {
      setNombreCategoria("");
    }
  }, [categoriaSeleccionada]);

  const manejarSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await guardarCategoria(nombreCategoria);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={cerrarModal}
    >

      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ENCABEZADO */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-2xl font-bold text-white">
              {categoriaSeleccionada
                ? "Editar categoría"
                : "Agregar categoría"}
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              {categoriaSeleccionada
                ? "Modificá el nombre de la categoría."
                : "Ingresá el nombre de la nueva categoría."}
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarModal}
            className="text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>

        </div>

        {/* FORMULARIO */}
        <form onSubmit={manejarSubmit}>

          <div className="mb-6">

            <label
              htmlFor="nombreCategoria"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Nombre de la categoría
            </label>

            <input
              id="nombreCategoria"
              type="text"
              value={nombreCategoria}
              onChange={(e) =>
                setNombreCategoria(e.target.value)
              }
              placeholder="Ej: Indumentaria deportiva"
              minLength={5}
              maxLength={100}
              required
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition"
            />

            <p className="text-xs text-slate-500 mt-2">
              El nombre debe tener entre 5 y 100 caracteres.
            </p>

          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={cerrarModal}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {guardando
                ? "Guardando..."
                : categoriaSeleccionada
                ? "Guardar cambios"
                : "Agregar categoría"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}