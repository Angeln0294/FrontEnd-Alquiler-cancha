import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { CanchaCard } from "./CanchasCardAdmin";
import CanchasContext from "../../../context/CanchasContext";
import { PaginadorBackend } from "../../Paginador"; // Asegurá la ruta correcta de tu componente de botones
import { usePaginacionBackend } from "../../../context/PaginacionContext"; // Usamos tu nuevo hook global

interface Cancha {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  disponible: boolean;
}

interface FormularioCancha {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: FileList;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  disponible: boolean;
}

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/canchas`;

export default function AdminCanchas() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Cancha | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  
  const [cantidadCanchas, setCantidadCanchas] = useState(0);
  const [limiteCanchas] = useState(6);

  // 1. IMPORTAMOS EL ESTADO GLOBAL DE PAGINACIÓN PARA CANCHAS
  const { paginaActual, setCantidadPaginas } = usePaginacionBackend("canchas");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormularioCancha>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: 0,
      imagen: undefined,
      tipo: "Fútbol 5",
      disponible: true,
    },
  });

  // ================================
  // CARGAR CANCHAS (Modificado para usar el contexto)
  // ================================
  const cargarCanchas = async () => {
    try {
      setCargando(true);

      // Usamos 'paginaActual' provista de forma global por el hook
      const respuesta = await fetch(
        `${API_URL}?pagina=${paginaActual}&limite=${limiteCanchas}`,
        {
          credentials: "include",
        },
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las canchas");
      }

      const resultado = await respuesta.json();

      setCanchas(resultado.canchas || []);
      setCantidadCanchas(resultado.cantidadCanchas || 0);

      // 2. LE INCOPORAMOS AL CONTEXTO LAS PÁGINAS TOTALES QUE DEVOLVIÓ EL BACKEND
      // Podés calcularlo con Math.ceil si tu API no te da un 'totalPaginas' directo
      const paginasTotales = resultado.totalPaginas || Math.ceil((resultado.cantidadCanchas || 0) / limiteCanchas);
      setCantidadPaginas(paginasTotales);

    } catch (error) {
      console.error("Error al cargar canchas:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las canchas.",
        background: "#0b0f19",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setCargando(false);
    }
  };

  // 3. SE DISPARA AUTOMÁTICAMENTE CADA VEZ QUE EL USUARIO CAMBIA DE PÁGINA EN EL CONTEXTO Global
  useEffect(() => {
    cargarCanchas();
  }, [paginaActual]);

  // ELIMINADO: 'cantidadPaginas' y 'cambiarPagina()' ya no van acá porque lo maneja el PaginadorBackend interno.

  // ================================
  // NUEVA CANCHA
  // ================================
  const abrirFormularioNueva = () => {
    setEditando(null);
    setVistaPrevia(null);

    reset({
      nombre: "",
      descripcion: "",
      precio: 0,
      imagen: undefined,
      tipo: "Fútbol 5",
      disponible: true,
    });

    setMostrarFormulario(true);
  };

  // ================================
  // EDITAR CANCHA
  // ================================
  const abrirFormularioEditar = (cancha: Cancha) => {
    setEditando(cancha);

    reset({
      nombre: cancha.nombre,
      descripcion: cancha.descripcion,
      precio: cancha.precio,
      tipo: cancha.tipo,
      disponible: cancha.disponible,
    });

    setMostrarFormulario(true);
  };

  // ================================
  // CERRAR FORMULARIO
  // ================================
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(null);
    setVistaPrevia(null);
    reset();
  };

  // ================================
  // GUARDAR CANCHA
  // ================================
  const guardarCancha = async (datos: FormularioCancha) => {
    try {
      setGuardando(true);

      const url = editando ? `${API_URL}/${editando._id}` : API_URL;
      const formData = new FormData();

      formData.append("nombre", datos.nombre);
      formData.append("descripcion", datos.descripcion);
      formData.append("precio", datos.precio.toString());
      formData.append("tipo", datos.tipo);
      formData.append("disponible", datos.disponible.toString());

      if (datos.imagen && datos.imagen.length > 0) {
        formData.append("imagen", datos.imagen[0]);
      }

      const respuesta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        credentials: "include",
        body: formData,
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.message ||
            resultado.mensaje ||
            "No se pudo guardar la cancha",
        );
      }

      await Swal.fire({
        icon: "success",
        title: editando ? "Cancha actualizada" : "Cancha creada",
        text: editando
          ? "La cancha se actualizó correctamente."
          : "La cancha se agregó correctamente.",
        background: "#0b0f19",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });

      cerrarFormulario();
      await cargarCanchas();
    } catch (error) {
      console.error("Error al guardar cancha:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo guardar la cancha.",
        background: "#0b0f19",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setGuardando(false);
    }
  };

  // ================================
  // ELIMINAR CANCHA
  // ================================
  const eliminarCancha = async (cancha: Cancha) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar cancha?",
      text: `Se eliminará "${cancha.nombre}". Esta acción no se puede deshacer.`,
      background: "#0b0f19",
      color: "#f8fafc",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#475569",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/${cancha._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.message ||
            resultado.mensaje ||
            "No se pudo eliminar la cancha",
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Cancha eliminada",
        text: "La cancha se eliminó correctamente.",
        background: "#0b0f19",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });

      await cargarCanchas();
    } catch (error) {
      console.error("Error al eliminar cancha:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la cancha.",
        background: "#0b0f19",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  // El bloque del return queda igual a como lo tenías, solo llamás al componente al final del listado:
  // <PaginadorBackend seccion="canchas" />


  return (
     <CanchasContext.Provider value={{ abrirFormularioEditar, eliminarCancha }}>
    <div className="space-y-8">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Administración
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Gestión de Canchas ⚽
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Administrá las canchas disponibles en Canchas Ya.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirFormularioNueva}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-green-500/20 hover:brightness-110 hover:-translate-y-0.5 transition-all"
        >
          <span className="text-lg">+</span>
          Nueva cancha
        </button>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-linear-to-b from-green-500/20 to-emerald-500/5 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-black/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">
                Total de canchas
              </p>

              <p className="text-3xl font-black mt-2">{cantidadCanchas}</p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-lg">
              ⚽
            </div>
          </div>
        </div>

        <div className="bg-linear-to-b from-blue-500/20 to-indigo-500/5 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-black/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">
                Canchas disponibles
              </p>

              <p className="text-3xl font-black mt-2">
                {canchas.filter((cancha) => cancha.disponible).length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-lg">
              ✅
            </div>
          </div>
        </div>
      </div>

      {/* LISTADO */}
      <div className="bg-linear-to-b from-slate-900/90 to-[#0b0f19] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800/80">
          <h2 className="text-lg font-bold tracking-tight">
            Canchas registradas
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Administrá la información de cada cancha.
          </p>
        </div>

        {cargando ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-slate-400 text-sm">Cargando canchas...</p>
          </div>
        ) : canchas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mx-auto mb-4 text-3xl">
              ⚽
            </div>

            <p className="text-slate-200 font-semibold">
              No hay canchas registradas
            </p>

            <p className="text-slate-500 text-xs mt-2">
              Agregá tu primera cancha para comenzar.
            </p>

            <button
              type="button"
              onClick={abrirFormularioNueva}
              className="mt-5 px-5 py-2.5 rounded-xl bg-green-500 text-slate-950 font-bold text-sm hover:bg-green-400 transition"
            >
              Agregar primera cancha
            </button>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {canchas.map((cancha) => (
              <CanchaCard key={cancha._id} cancha={cancha} />
            ))}
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      <PaginadorBackend seccion="canchas" />


      {/* MODAL */}
      {mostrarFormulario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0b0f19] border border-slate-800 rounded-3xl shadow-2xl">
            {/* HEADER */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editando ? "Editar cancha" : "Nueva cancha"}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Completá los datos de la cancha.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                ✕
              </button>
            </div>

            {/* FORMULARIO */}
            <form
              onSubmit={handleSubmit(guardarCancha)}
              className="p-6 space-y-5"
            >
              {/* NOMBRE */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nombre
                </label>

                <input
                  type="text"
                  placeholder="Ej: Cancha Fútbol 5"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "El nombre no puede superar los 50 caracteres",
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-600 focus:outline-none transition ${
                    errors.nombre
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-slate-800 focus:border-green-500"
                  }`}
                />

                {errors.nombre && (
                  <p className="text-rose-400 text-xs mt-1.5">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Descripción
                </label>

                <textarea
                  rows={3}
                  placeholder="Descripción de la cancha..."
                  {...register("descripcion", {
                    required: "La descripción es obligatoria",
                    minLength: {
                      value: 5,
                      message:
                        "La descripción debe tener al menos 5 caracteres",
                    },
                    maxLength: {
                      value: 200,
                      message:
                        "La descripción no puede superar los 200 caracteres",
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

              {/* PRECIO + TIPO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "El precio debe ser mayor o igual a 0",
                      },
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

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Tipo de cancha
                  </label>

                  <select
                    {...register("tipo", {
                      required: "El tipo de cancha es obligatorio",
                    })}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 focus:outline-none transition ${
                      errors.tipo
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-slate-800 focus:border-green-500"
                    }`}
                  >
                    <option value="Fútbol 5">Fútbol 5</option>

                    <option value="Fútbol 7">Fútbol 7</option>

                    <option value="Fútbol 11">Fútbol 11</option>
                  </select>

                  {errors.tipo && (
                    <p className="text-rose-400 text-xs mt-1.5">
                      {errors.tipo.message}
                    </p>
                  )}
                </div>
              </div>

              {/* IMAGEN */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Imagen de la cancha
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  {...register("imagen", {
                    required: editando ? false : "La imagen es obligatoria",
                    onChange: (e) => {
                      const archivo = e.target.files?.[0];

                      if (archivo) {
                        setVistaPrevia(URL.createObjectURL(archivo));
                      } else {
                        setVistaPrevia(null);
                      }
                    },
                  })}
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
                    <p className="text-xs text-slate-400 mb-2">Vista previa</p>

                    <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                      <img
                        src={vistaPrevia}
                        alt="Vista previa de la cancha"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* DISPONIBLE */}
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("disponible")}
                  className="w-5 h-5 accent-green-500"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Cancha disponible
                  </p>

                  <p className="text-xs text-slate-500">
                    Indica si la cancha puede ser reservada.
                  </p>
                </div>
              </label>

              {/* BOTONES */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="flex-1 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition font-semibold"
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
                    : editando
                      ? "Guardar cambios"
                      : "Crear cancha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </CanchasContext.Provider>
  );
}
