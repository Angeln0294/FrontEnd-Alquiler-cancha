import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form"; // REGLA STRICT: Importación explícita de tipo
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

// 1. Estructura fuertemente tipada de los campos de inicio de sesión
interface LoginValores {
  email: string;
  contrasenia: string;
}

export default function Login() {
  const navigate = useNavigate();
const { cargarUsuario } = useAuth();
  // 2. Pasamos la interfaz LoginValores como tipo genérico a useForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValores>({
    mode: "onTouched",
  });

  // 3. Tipamos la función usando SubmitHandler con nuestra interfaz
  const alEnviar: SubmitHandler<LoginValores> = async (datos) => {
    try {
      const respuesta = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usuario/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: datos.email,
          password: datos.contrasenia,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo iniciar sesión",
          text: resultado.mensaje || "Verificá tu email y contraseña.",
          confirmButtonText: "Entendido",
          background: "#0b132b",
          color: "#ffffff",
          confirmButtonColor: "#22c55e",
          iconColor: "#ef4444",
        });

        return;
      }

      console.log("Inicio de sesión exitoso:", resultado);

      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: resultado.mensaje || "Sesión iniciada correctamente.",
        confirmButtonText: "Continuar",
        background: "#0b132b",
        color: "#ffffff",
        confirmButtonColor: "#22c55e",
        iconColor: "#22c55e",
      });

     await cargarUsuario();
navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      await Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor.",
        confirmButtonText: "Entendido",
        background: "#0b132b",
        color: "#ffffff",
        confirmButtonColor: "#22c55e",
        iconColor: "#ef4444",
      });
    }
  };
  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#0b132b] flex items-center justify-center p-6 text-white">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        {/* Cabecera del formulario */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl mx-auto mb-2 shadow-lg shadow-green-500/20">
            ⚽
          </div>
          <h2 className="text-2xl font-bold text-gray-100">
            ¡Bienvenido de nuevo!
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Iniciá sesión para reservar tus canchas favoritas
          </p>
        </div>

        {/* Formulario conectado a handleSubmit */}
        <form
          onSubmit={handleSubmit(alEnviar)}
          className="space-y-4"
          noValidate
        >
          {/* Campo: Correo Electrónico */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              disabled={isSubmitting}
              className={`w-full p-3 rounded-lg bg-slate-800 border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-700 focus:ring-green-500"
              } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50`}
              {...register("email", {
                required: "El correo es obligatorio.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

                  message: "El formato de correo no es válido.",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo: Contraseña */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Contraseña
              </label>
              <a
                href="#recuperar"
                className="text-xs text-green-400 hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full p-3 rounded-lg bg-slate-800 border ${
                errors.contrasenia
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-700 focus:ring-green-500"
              } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50`}
              {...register("contrasenia", {
                required: "La contraseña es obligatoria.",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener mínimo 6 caracteres.",
                },
              })}
            />
            {errors.contrasenia && (
              <p className="text-red-400 text-xs mt-1">
                {errors.contrasenia.message}
              </p>
            )}
          </div>

          {/* Botón de Ingreso con Spinner */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700 text-slate-950 font-bold p-3 rounded-lg transition duration-200 mt-2 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-slate-950"
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Validando acceso...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

      {/* 🟢 REEMPLAZÁ LA PARTE INFERIOR DEL LOGIN POR ESTE BLOQUE CON ICONOS ORIGINALES Y LINKS REALES: */}

{/* Divisor estético */}
<div className="relative flex py-2 items-center mt-6">
  <div className="grow border-t border-slate-800/80"></div>
  <span className="shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
    O continuar con
  </span>
  <div className="grow border-t border-slate-800/80"></div>
</div>

{/* Grilla de botones con los logotipos SVG oficiales */}
<div className="grid grid-cols-2 gap-3 mt-3">
  {/* Botón Google con logotipo oficial */}
  <a
    href="https://google.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all text-center no-underline cursor-pointer shadow-md"
    title="Iniciar sesión con Google"
  >
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    <span>Google</span>
  </a>
  
  {/* Botón Facebook con logotipo oficial */}
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all text-center no-underline cursor-pointer shadow-md"
    title="Iniciar sesión con Facebook"
  >
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://w3.org">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
    <span>Facebook</span>
  </a>
</div>

{/* Enlace cruzado para ir al formulario de Registro */}
<div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-800/60 mt-4">
  ¿No tienes una cuenta activa todavía?{" "}
  <button 
    type="button"
    onClick={() => navigate('/registro')} 
    className="text-green-400 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline ml-1 text-xs"
  >
    Regístrate acá
  </button>
</div>

      </div>
    </div>
  );
}
