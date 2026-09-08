import { useAuth } from "../context/AuthContext";

export default function MiPerfil() {
  const { usuario } = useAuth();

  if (!usuario) {
    return null;
  }

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

          {/* Información */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Información de la cuenta
            </h2>

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
                <p className="font-medium mt-1">
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

            {/* Verificación */}
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
          </div>
        </div>
      </div>
    </main>
  );
}