
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";


export default function MiPerfil() {
  const { usuario, cargarUsuario } = useAuth();

  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [apellido, setApellido] = useState(usuario?.apellido || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [guardando, setGuardando] = useState(false);

  if (!usuario) {
    return null;
  }
const navigate = useNavigate();
  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();

    setGuardando(true);

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
            nombre,
            apellido,
            email,
          }),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo actualizar",
          text: resultado.mensaje || "Ocurrió un error al actualizar el perfil.",
        });

        return;
      }

      const emailCambio = email.toLowerCase().trim() !== usuario.email;

    await cargarUsuario();

setEditando(false);

if (emailCambio) {
  await Swal.fire({
    icon: "info",
    title: "Email actualizado",
    text: "Te enviamos un nuevo código de verificación a tu correo.",
    confirmButtonText: "Verificar email",
  });

  navigate("/verificar-email", {
    state: {
      email: email.toLowerCase().trim(),
    },
  });

  return;
}else {
        await Swal.fire({
          icon: "success",
          title: "Perfil actualizado",
          text: "Tus datos fueron actualizados correctamente.",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setEmail(usuario.email);
    setEditando(false);
  };

  return (
    <main className="min-h-screen bg-[#0b132b] text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#111c3a] rounded-2xl shadow-lg overflow-hidden">

          {/* Encabezado */}
          <div className="bg-green-500 px-6 py-8 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-white text-green-600 flex items-center justify-center text-4xl font-bold">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>

            <h1 className="text-2xl font-bold mt-4">
              Mi Perfil
            </h1>

            <p className="text-green-950 mt-1">
              Hola, {usuario.nombre}
            </p>
          </div>

          {/* Contenido */}
          <div className="p-6">

            {!editando ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Información de la cuenta
                  </h2>

                  <button
                    type="button"
                    onClick={() => setEditando(true)}
                    className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition"
                  >
                    ✏️ Editar perfil
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  <div className="bg-[#0b132b] rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                      Nombre
                    </p>
                    <p className="font-medium mt-1">
                      {usuario.nombre}
                    </p>
                  </div>

                  <div className="bg-[#0b132b] rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                      Apellido
                    </p>
                    <p className="font-medium mt-1">
                      {usuario.apellido}
                    </p>
                  </div>

                  <div className="bg-[#0b132b] rounded-lg p-4 md:col-span-2">
                    <p className="text-sm text-gray-400">
                      Correo electrónico
                    </p>
                    <p className="font-medium mt-1 break-all">
                      {usuario.email}
                    </p>
                  </div>

                  <div className="bg-[#0b132b] rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                      Tipo de cuenta
                    </p>
                    <p className="font-medium mt-1 capitalize">
                      {usuario.rol}
                    </p>
                  </div>

                  <div className="bg-[#0b132b] rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                      Estado de la cuenta
                    </p>
                    <p className="font-medium mt-1">
                      {usuario.activo ? "Activa" : "Inactiva"}
                    </p>
                  </div>

                </div>

                <div className="mt-6 bg-[#0b132b] rounded-lg p-4">
                  <p className="text-sm text-gray-400">
                    Estado del correo
                  </p>

                  <p className="font-medium mt-1">
                    {usuario.emailVerificado
                      ? "✓ Correo verificado"
                      : "⚠ Correo no verificado"}
                  </p>
                </div>
              </>
            ) : (
              <form onSubmit={guardarCambios}>

                <h2 className="text-xl font-semibold mb-6">
                  Editar información
                </h2>

                {/* Nombre */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">
                    Nombre
                  </label>

                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full bg-[#0b132b] border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-green-400"
                  />
                </div>

                {/* Apellido */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">
                    Apellido
                  </label>

                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                    className="w-full bg-[#0b132b] border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-green-400"
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-300 mb-2">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#0b132b] border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-green-400"
                  />

                  <p className="text-xs text-gray-400 mt-2">
                    Si cambiás tu correo, tendrás que verificarlo nuevamente.
                  </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    type="submit"
                    disabled={guardando}
                    className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-4 py-3 rounded-lg transition"
                  >
                    {guardando ? "Guardando..." : "💾 Guardar cambios"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    disabled={guardando}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-lg transition"
                  >
                    Cancelar
                  </button>

                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}