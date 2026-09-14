import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCategorias } from "../context/CategoriaContext";

interface FormularioCategoria {
  nombreCategoria: string;
}

export default function FormularioCategoriaAdmin() {
  const { categoriaSeleccionada, guardando, cerrarModal, guardarCategoria } =
    useCategorias();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormularioCategoria>({
    mode: "onSubmit",
    defaultValues: {
      nombreCategoria: "",
    },
  });
  // Cargar los datos cuando estamos editando
  useEffect(() => {
    if (categoriaSeleccionada) {
      reset({
        nombreCategoria: categoriaSeleccionada.nombreCategoria,
      });
    } else {
      reset({
        nombreCategoria: "",
      });
    }
  }, [categoriaSeleccionada, reset]);

  const manejarSubmit = async (datos: FormularioCategoria) => {
    await guardarCategoria(datos.nombreCategoria.trim());
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
              {categoriaSeleccionada ? "Editar categoría" : "Agregar categoría"}
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
        <form onSubmit={handleSubmit(manejarSubmit)}>
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
              placeholder="Ej: Indumentaria deportiva"
              {...register("nombreCategoria", {
                required: "El nombre de la categoría es obligatorio",
                minLength: {
                  value: 5,
                  message: "El nombre debe tener al menos 5 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "El nombre no puede superar los 100 caracteres",
                },
              })}
              className={`w-full bg-slate-800 border text-white rounded-xl px-4 py-3 outline-none transition ${
                errors.nombreCategoria
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />

            {errors.nombreCategoria && (
              <p className="text-rose-400 text-xs mt-1.5">
                {errors.nombreCategoria.message}
              </p>
            )}
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
