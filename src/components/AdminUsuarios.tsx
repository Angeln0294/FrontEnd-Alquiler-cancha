import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import type { SubmitHandler } from "react-hook-form";

import Swal from "sweetalert2";

interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: "usuario" | "admin";
  activo: boolean;
  emailVerificado: boolean;
}

interface FormularioUsuario {
  nombre: string;
  apellido: string;
  email: string;
  rol: "usuario" | "admin";
  activo: boolean;
}

const swalTema = Swal.mixin({
  background: "#0b132b",
  color: "#ffffff",
  confirmButtonColor: "#22c55e",
  cancelButtonColor: "#475569",
  customClass: {
    popup: "border border-slate-700 rounded-2xl",
    title: "text-white",
    htmlContainer: "text-slate-400",
    confirmButton: "rounded-lg",
    cancelButton: "rounded-lg",
  },
});

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  // ==========================================
  // PAGINACIÓN
  // ==========================================

  const usuariosPorPagina = 5;

  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);

  const indiceInicio = (paginaActual - 1) * usuariosPorPagina;

  const indiceFin = indiceInicio + usuariosPorPagina;

  const usuariosPagina = usuarios.slice(indiceInicio, indiceFin);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormularioUsuario>({
    mode: "onTouched",
  });

  const nombreActual = watch("nombre", "");
  const apellidoActual = watch("apellido", "");
  const emailActual = watch("email", "");

  // ==========================================
  // OBTENER USUARIOS
  // ==========================================

  const cargarUsuarios = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch("http://localhost:3003/api/usuario", {
        credentials: "include",
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "No se pudieron obtener los usuarios",
        );
      }

      setUsuarios(resultado);

      // Volver a la primera página al cargar nuevamente
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);

      await swalTema.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios.",
        confirmButtonText: "Entendido",
        iconColor: "#ef4444",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // ==========================================
  // ABRIR MODAL EDITAR
  // ==========================================

  const abrirEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);

    reset({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
    });
  };

  // ==========================================
  // CERRAR MODAL
  // ==========================================

  const cerrarModal = () => {
    setUsuarioEditando(null);
    reset();
  };

  // ==========================================
  // GUARDAR CAMBIOS
  // ==========================================

  const guardarCambios: SubmitHandler<FormularioUsuario> = async (datos) => {
    if (!usuarioEditando) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3003/api/usuario/${usuarioEditando._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(datos),
        },
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        await swalTema.fire({
          icon: "error",
          title: "No se pudieron guardar los cambios",
          text: resultado.mensaje || "Ocurrió un error.",
          confirmButtonText: "Entendido",
          iconColor: "#ef4444",
        });

        return;
      }

      await swalTema.fire({
        icon: "success",
        title: "¡Usuario actualizado!",
        text: resultado.mensaje || "Los cambios se guardaron correctamente.",
        confirmButtonText: "Continuar",
        iconColor: "#22c55e",
      });

      cerrarModal();
      cargarUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);

      await swalTema.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor.",
        confirmButtonText: "Entendido",
        iconColor: "#ef4444",
      });
    }
  };

  // ==========================================
  // CAMBIAR ROL
  // ==========================================

  const cambiarRol = async (
    usuario: Usuario,
    nuevoRol: "usuario" | "admin",
  ) => {
    if (usuario.rol === nuevoRol) return;

    const confirmacion = await swalTema.fire({
      icon: "warning",
      title: "¿Cambiar rol?",
      text: `El usuario pasará a tener el rol "${nuevoRol}".`,
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      iconColor: "#f59e0b",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3003/api/usuario/${usuario._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            rol: nuevoRol,
          }),
        },
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo cambiar el rol");
      }

      setUsuarios((usuariosActuales) =>
        usuariosActuales.map((u) =>
          u._id === usuario._id ? { ...u, rol: nuevoRol } : u,
        ),
      );

      await swalTema.fire({
        icon: "success",
        title: "Rol actualizado",
        text: "El rol se cambió correctamente.",
        confirmButtonText: "Continuar",
        iconColor: "#22c55e",
      });
    } catch (error) {
      console.error("Error al cambiar rol:", error);

      await swalTema.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el rol.",
        confirmButtonText: "Entendido",
        iconColor: "#ef4444",
      });
    }
  };

  // ==========================================
  // CAMBIAR ESTADO
  // ==========================================

  const cambiarEstado = async (usuario: Usuario, nuevoEstado: boolean) => {
    if (usuario.activo === nuevoEstado) return;

    const confirmacion = await swalTema.fire({
      icon: "warning",
      title: nuevoEstado ? "¿Activar usuario?" : "¿Desactivar usuario?",
      text: nuevoEstado
        ? "El usuario podrá utilizar nuevamente su cuenta."
        : "El usuario no podrá utilizar su cuenta.",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      iconColor: "#f59e0b",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3003/api/usuario/${usuario._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            activo: nuevoEstado,
          }),
        },
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo cambiar el estado");
      }

      setUsuarios((usuariosActuales) =>
        usuariosActuales.map((u) =>
          u._id === usuario._id ? { ...u, activo: nuevoEstado } : u,
        ),
      );

      await swalTema.fire({
        icon: "success",
        title: "Estado actualizado",
        text: "El estado del usuario se cambió correctamente.",
        confirmButtonText: "Continuar",
        iconColor: "#22c55e",
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);

      await swalTema.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado.",
        confirmButtonText: "Entendido",
        iconColor: "#ef4444",
      });
    }
  };

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================

  const eliminarUsuario = async (usuario: Usuario) => {
    const confirmacion = await swalTema.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${usuario.nombre} ${usuario.apellido}. Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      iconColor: "#ef4444",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3003/api/usuario/${usuario._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo eliminar el usuario");
      }

      setUsuarios((usuariosActuales) => {
        const usuariosActualizados = usuariosActuales.filter(
          (u) => u._id !== usuario._id,
        );

        const nuevasPaginas = Math.ceil(
          usuariosActualizados.length / usuariosPorPagina,
        );

        setPaginaActual((pagina) =>
          Math.min(pagina, Math.max(nuevasPaginas, 1)),
        );

        return usuariosActualizados;
      });

      await swalTema.fire({
        icon: "success",
        title: "Usuario eliminado",
        text: "El usuario fue eliminado correctamente.",
        confirmButtonText: "Continuar",
        iconColor: "#22c55e",
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);

      await swalTema.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el usuario.",
        confirmButtonText: "Entendido",
        iconColor: "#ef4444",
      });
    }
  };

  // ==========================================
  // ESTILOS
  // ==========================================

  const inputBase =
    "w-full rounded-lg border bg-[#111c36] px-4 py-3 text-white outline-none transition placeholder:text-slate-500";

  const inputNormal = `${inputBase} border-slate-700 focus:border-green-500`;

  const inputError = `${inputBase} border-red-500 focus:border-red-500`;

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-slate-400">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ========================================
          ENCABEZADO
      ======================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de usuarios</h1>

        <p className="mt-1 text-slate-400">
          Administra los usuarios registrados en el sistema.
        </p>
      </div>

      {/* ========================================
          TABLA / GRID
      ======================================== */}

      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-[#0b132b]">
        <table className="w-full min-w-225 text-left">
          <thead className="border-b border-slate-700 bg-[#111c36]">
            <tr>
              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Nombre
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Email
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Rol
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Estado
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Verificación
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {usuariosPagina.map((usuario) => (
              <tr
                key={usuario._id}
                className="border-b border-slate-800 transition hover:bg-[#111c36]"
              >
                <td className="px-5 py-4 text-white">
                  <div>
                    <p className="font-medium">
                      {usuario.nombre} {usuario.apellido}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-400">{usuario.email}</td>

                {/* ROL */}

                <td className="px-5 py-4">
                  <select
                    value={usuario.rol}
                    onChange={(e) =>
                      cambiarRol(usuario, e.target.value as "usuario" | "admin")
                    }
                    className="rounded-lg border border-slate-700 bg-[#111c36] px-3 py-2 text-sm text-white outline-none focus:border-green-500"
                  >
                    <option value="usuario">Usuario</option>

                    <option value="admin">Admin</option>
                  </select>
                </td>

                {/* ESTADO */}

                <td className="px-5 py-4">
                  <select
                    value={usuario.activo ? "activo" : "inactivo"}
                    onChange={(e) =>
                      cambiarEstado(usuario, e.target.value === "activo")
                    }
                    className="rounded-lg border border-slate-700 bg-[#111c36] px-3 py-2 text-sm text-white outline-none focus:border-green-500"
                  >
                    <option value="activo">Activo</option>

                    <option value="inactivo">Inactivo</option>
                  </select>
                </td>

                {/* VERIFICACIÓN */}

                <td className="px-5 py-4">
                  {usuario.emailVerificado ? (
                    <span className="text-sm font-medium text-green-500">
                      Verificado
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-500">
                      No verificado
                    </span>
                  )}
                </td>

                {/* ACCIONES */}

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => abrirEditar(usuario)}
                      className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarUsuario(usuario)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================
          PAGINACIÓN
      ======================================== */}

      {totalPaginas > 1 && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-700 bg-[#0b132b] px-5 py-4">
          <p className="text-sm text-slate-400">
            Mostrando{" "}
            <span className="font-medium text-white">{indiceInicio + 1}</span> -{" "}
            <span className="font-medium text-white">
              {Math.min(indiceFin, usuarios.length)}
            </span>{" "}
            de <span className="font-medium text-white">{usuarios.length}</span>{" "}
            usuarios
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPaginaActual((pagina) => Math.max(pagina - 1, 1))
              }
              disabled={paginaActual === 1}
              className="rounded-lg border border-slate-700 bg-[#111c36] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2948] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <span className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white">
              {paginaActual} / {totalPaginas}
            </span>

            <button
              type="button"
              onClick={() =>
                setPaginaActual((pagina) => Math.min(pagina + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas}
              className="rounded-lg border border-slate-700 bg-[#111c36] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2948] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* ========================================
          MODAL EDITAR USUARIO
      ======================================== */}

      {usuarioEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#0b132b] p-6 shadow-2xl">
            {/* ENCABEZADO MODAL */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Editar usuario
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Modifica los datos del usuario.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarModal}
                className="text-2xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            {/* FORMULARIO */}

            <form onSubmit={handleSubmit(guardarCambios)} className="space-y-5">
              {/* NOMBRE */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-white">
                    Nombre
                  </label>

                  {nombreActual.length === 25 && (
                    <span className="text-xs font-medium text-red-500">
                      Máximo alcanzado
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  maxLength={25}
                  className={errors.nombre ? inputError : inputNormal}
                  {...register("nombre", {
                    required: "El nombre es obligatorio.",
                    minLength: {
                      value: 2,
                      message: "El nombre debe tener al menos 2 caracteres.",
                    },
                    maxLength: {
                      value: 25,
                      message: "El nombre no puede superar los 25 caracteres.",
                    },
                  })}
                />

                {errors.nombre && (
                  <p className="mt-1 text-sm font-medium text-red-500">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* APELLIDO */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-white">
                    Apellido
                  </label>

                  {apellidoActual.length === 25 && (
                    <span className="text-xs font-medium text-red-500">
                      Máximo alcanzado
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  maxLength={25}
                  className={errors.apellido ? inputError : inputNormal}
                  {...register("apellido", {
                    required: "El apellido es obligatorio.",
                    minLength: {
                      value: 2,
                      message: "El apellido debe tener al menos 2 caracteres.",
                    },
                    maxLength: {
                      value: 25,
                      message:
                        "El apellido no puede superar los 25 caracteres.",
                    },
                  })}
                />

                {errors.apellido && (
                  <p className="mt-1 text-sm font-medium text-red-500">
                    {errors.apellido.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-white">
                    Email
                  </label>

                  {emailActual.length === 50 && (
                    <span className="text-xs font-medium text-red-500">
                      Máximo alcanzado
                    </span>
                  )}
                </div>

                <input
                  type="email"
                  maxLength={50}
                  className={errors.email ? inputError : inputNormal}
                  {...register("email", {
                    required: "El email es obligatorio.",
                    maxLength: {
                      value: 50,
                      message: "El email no puede superar los 50 caracteres.",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message:
                        "Ingresá un email válido. Ejemplo: usuario@gmail.com",
                    },
                  })}
                />

                {errors.email && (
                  <p className="mt-1 text-sm font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* ROL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Rol
                </label>

                <select className={inputNormal} {...register("rol")}>
                  <option value="usuario">Usuario</option>

                  <option value="admin">Administrador</option>
                </select>
              </div>

              {/* ESTADO */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Estado
                </label>

                <select
                  className={inputNormal}
                  {...register("activo", {
                    setValueAs: (value) => value === "true",
                  })}
                >
                  <option value="true">Activo</option>

                  <option value="false">Inactivo</option>
                </select>
              </div>

              {/* BOTONES */}

              <div className="flex justify-end gap-3 border-t border-slate-700 pt-5">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="rounded-lg bg-slate-600 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
