import { useEffect, useState } from "react";
import {
  useForm,
  type FieldErrors,
} from "react-hook-form";
import Swal from "sweetalert2";
import { useProductos } from "../context/ProductoContext";

interface FormularioProducto {
  nombreProducto: string;
  precio: string;
  categoria: string;
  descripcion: string;
  imagen: FileList;
}

export default function FormularioProductoAdmin() {
  const {
    productoSeleccionado,
    categorias,
    guardando,
    cerrarModal,
    guardarProducto,
  } = useProductos();

  const [imagen, setImagen] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormularioProducto>({
    mode: "onSubmit",
    defaultValues: {
      nombreProducto: "",
      precio: "",
      categoria: "",
      descripcion: "",
    },
  });

  // ================================
  // CARGAR DATOS AL EDITAR
  // ================================
  useEffect(() => {
    if (productoSeleccionado) {
      const categoriaId =
        typeof productoSeleccionado.categoria === "object"
          ? productoSeleccionado.categoria._id
          : productoSeleccionado.categoria;

      reset({
        nombreProducto: productoSeleccionado.nombreProducto,
        precio: String(productoSeleccionado.precio),
        categoria: categoriaId,
        descripcion: productoSeleccionado.descripcion,
      });

      setImagen(null);
      setVistaPrevia(null);
      clearErrors();
    } else {
      reset({
        nombreProducto: "",
        precio: "",
        categoria: "",
        descripcion: "",
      });

      setImagen(null);
      setVistaPrevia(null);
      clearErrors();
    }
  }, [productoSeleccionado, reset, clearErrors]);

  // ================================
  // IMAGEN
  // ================================
  const manejarImagen = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const archivo = e.target.files?.[0];

    if (!archivo) {
      setImagen(null);
      setVistaPrevia(null);

      if (!productoSeleccionado) {
        setError("imagen", {
          type: "required",
          message: "La imagen es obligatoria",
        });
      }

      return;
    }

    // Máximo 2 MB
    if (archivo.size > 2 * 1024 * 1024) {
      setImagen(null);
      setVistaPrevia(null);

      setError("imagen", {
        type: "validate",
        message: "La imagen no puede superar los 2 MB",
      });

      e.target.value = "";

      return;
    }

    setImagen(archivo);
    setVistaPrevia(URL.createObjectURL(archivo));

    clearErrors("imagen");

    setValue("imagen", e.target.files as FileList, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // ================================
  // ERRORES
  // ================================
  const manejarErrores = (
    errores: FieldErrors<FormularioProducto>,
  ) => {
    console.log("ERRORES DEL FORMULARIO:", errores);
  };

  // ================================
  // GUARDAR
  // ================================
  const manejarSubmit = async (
    datos: FormularioProducto,
  ) => {
    console.log("DATOS DEL FORMULARIO:", datos);

    if (!productoSeleccionado && !imagen) {
      setError("imagen", {
        type: "required",
        message: "La imagen es obligatoria",
      });

      return;
    }

    const datosProducto = {
      nombreProducto: datos.nombreProducto.trim(),
      precio: Number(datos.precio),
      categoria: datos.categoria,
      imagen: imagen,
      descripcion: datos.descripcion.trim(),
    };

    console.log(
      "DATOS QUE SE ENVIAN AL CONTEXT:",
      datosProducto,
    );

    try {
      await guardarProducto(datosProducto);

      await Swal.fire({
        icon: "success",
        title: productoSeleccionado
          ? "Producto actualizado"
          : "Producto creado",
        text: productoSeleccionado
          ? "El producto se actualizó correctamente."
          : "El producto se agregó correctamente.",
        background: "#0b0f19",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    } catch (error) {
      console.error("Error al guardar:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el producto.",
        background: "#0b0f19",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">

      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0b0f19] border border-slate-800 rounded-3xl shadow-2xl">

        {/* ================================
            HEADER
        ================================= */}

        <div className="p-6 border-b border-slate-800 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {productoSeleccionado
                ? "Editar producto"
                : "Nuevo producto"}
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Completá los datos del producto.
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarModal}
            disabled={guardando}
            className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition disabled:opacity-50"
          >
            ✕
          </button>

        </div>

        {/* ================================
            FORMULARIO
        ================================= */}

        <form
          onSubmit={handleSubmit(
            manejarSubmit,
            manejarErrores,
          )}
          className="p-6 space-y-5"
        >

          {/* ================================
              NOMBRE
          ================================= */}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Nombre del producto
            </label>

            <input
              type="text"
              placeholder="Ej: Remera deportiva"
              {...register("nombreProducto", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 2,
                  message:
                    "El nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message:
                    "El nombre no puede superar los 50 caracteres",
                },
              })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-600 focus:outline-none transition ${
                errors.nombreProducto
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-800 focus:border-green-500"
              }`}
            />

            {errors.nombreProducto && (
              <p className="text-rose-400 text-xs mt-1.5">
                {errors.nombreProducto.message}
              </p>
            )}
          </div>

          {/* ================================
              PRECIO + CATEGORIA
          ================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* PRECIO */}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Precio
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 25000"
                {...register("precio", {
                  required: "El precio es obligatorio",
                  validate: (valor) =>
                    Number(valor) >= 0 ||
                    "El precio no puede ser negativo",
                })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-600 focus:outline-none transition ${
                  errors.precio
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-slate-800 focus:border-green-500"
                }`}
              />

              {errors.precio && (
                <p className="text-rose-400 text-xs mt-1.5">
                  {errors.precio.message}
                </p>
              )}
            </div>

            {/* CATEGORIA */}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Categoría
              </label>

              <select
                {...register("categoria", {
                  required: "La categoría es obligatoria",
                })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 focus:outline-none transition ${
                  errors.categoria
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-slate-800 focus:border-green-500"
                }`}
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

              {errors.categoria && (
                <p className="text-rose-400 text-xs mt-1.5">
                  {errors.categoria.message}
                </p>
              )}
            </div>

          </div>

          {/* ================================
              IMAGEN
          ================================= */}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Imagen del producto
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={manejarImagen}
              className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-slate-950 file:font-semibold hover:file:bg-green-400 focus:outline-none transition ${
                errors.imagen
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-800 focus:border-green-500"
              }`}
            />

            <p className="text-xs text-slate-500 mt-2">
              Formatos permitidos: JPG, PNG o WEBP. Máximo 2 MB.
            </p>

            {errors.imagen && (
              <p className="text-rose-400 text-xs mt-1.5">
                {errors.imagen.message}
              </p>
            )}

            {/* VISTA PREVIA */}

            {vistaPrevia && (
              <div className="mt-4">

                <p className="text-xs text-slate-400 mb-2">
                  Vista previa
                </p>

                <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">

                  <img
                    src={vistaPrevia}
                    alt="Vista previa del producto"
                    className="w-full h-full object-cover"
                  />

                </div>

              </div>
            )}
          </div>

          {/* ================================
              DESCRIPCION
          ================================= */}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Descripción
            </label>

            <textarea
              rows={4}
              placeholder="Descripción del producto..."
              {...register("descripcion", {
                required:
                  "La descripción es obligatoria",
                minLength: {
                  value: 5,
                  message:
                    "La descripción debe tener al menos 5 caracteres",
                },
                maxLength: {
                  value: 500,
                  message:
                    "La descripción no puede superar los 500 caracteres",
                },
              })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-600 focus:outline-none transition resize-none ${
                errors.descripcion
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-800 focus:border-green-500"
              }`}
            />

            {errors.descripcion && (
              <p className="text-rose-400 text-xs mt-1.5">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          {/* ================================
              BOTONES
          ================================= */}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">

            <button
              type="button"
              onClick={cerrarModal}
              disabled={guardando}
              className="flex-1 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="flex-1 px-5 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-slate-950 font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
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