import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCategorias } from "../context/CategoriaContext";

interface FormularioCategoria {
  nombreCategoria: string;
}

export default function FormularioCategoriaAdmin() {
  const { categoriaSeleccionada, guardando, cerrarModal, guardarCategoria } =
    useCategorias();

  const modalRef = useRef<HTMLDivElement>(null);
  const botonAnteriorRef = useRef<HTMLElement | null>(null);
  const cerrarModalRef = useRef(cerrarModal);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormularioCategoria>({
    mode: "onSubmit",
    defaultValues: {
      nombreCategoria: "",
    },
  });

  useEffect(() => {
    cerrarModalRef.current = cerrarModal;
  }, [cerrarModal]);

  useEffect(() => {
    if (categoriaSeleccionada) {
      reset({
        nombreCategoria: categoriaSeleccionada.nombreCategoria,
      });
    }
  }, [categoriaSeleccionada, reset]);

  useEffect(() => {
    botonAnteriorRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const marco = requestAnimationFrame(() => {
      setFocus("nombreCategoria");
    });

    const manejarTeclado = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cerrarModalRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const modal = modalRef.current;
      if (!modal) return;

      const elementos = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((elemento) => elemento.getClientRects().length > 0);

      if (elementos.length === 0) {
        event.preventDefault();
        return;
      }

      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      } else if (!modal.contains(document.activeElement)) {
        event.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", manejarTeclado);

    return () => {
      cancelAnimationFrame(marco);
      document.removeEventListener("keydown", manejarTeclado);
      requestAnimationFrame(() => {
        if (botonAnteriorRef.current?.isConnected) {
          botonAnteriorRef.current.focus();
        }
      });
    };
  }, [setFocus]);

  const manejarSubmit = async (datos: FormularioCategoria) => {
    console.log("DATOS DEL FORMULARIO:", datos);
    await guardarCategoria(datos.nombreCategoria.trim());
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={cerrarModal}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-categoria"
        aria-describedby="descripcion-modal-categoria"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              id="titulo-modal-categoria"
              className="text-2xl font-bold text-white"
            >
              {categoriaSeleccionada ? "Editar categoría" : "Agregar categoría"}
            </h2>

            <p
              id="descripcion-modal-categoria"
              className="text-slate-400 text-sm mt-1"
            >
              {categoriaSeleccionada
                ? "Modificá el nombre de la categoría."
                : "Ingresá el nombre de la nueva categoría."}
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarModal}
            aria-label="Cerrar formulario de categoría"
            className="text-slate-400 hover:text-white text-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            ✕
          </button>
        </div>

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
              aria-invalid={!!errors.nombreCategoria}
              aria-describedby={
                errors.nombreCategoria
                  ? "ayuda-categoria error-categoria"
                  : "ayuda-categoria"
              }
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
              <p
                id="error-categoria"
                role="alert"
                className="text-rose-400 text-xs mt-1.5"
              >
                {errors.nombreCategoria.message}
              </p>
            )}

            <p id="ayuda-categoria" className="text-xs text-slate-500 mt-2">
              El nombre debe tener entre 5 y 100 caracteres.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
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
