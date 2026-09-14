import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form"; // Importación estricta de tipo requerida por verbatimModuleSyntax
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// 1. Estructura fuertemente tipada de los campos de tu formulario
interface FormValores {
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  confirmarContrasenia: string;
}

export default function Registro() {
  const navigate = useNavigate();

  // 2. Pasamos el tipo genérico <FormValores> a useForm
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValores>({
    mode: "onTouched",
  });

  // 3. TypeScript sabe automáticamente que contraseniaValue es un string
  const contraseniaValue = watch("contrasenia");

  // 4. Usamos SubmitHandler para tipar de forma segura la función alEnviar
  const alEnviar: SubmitHandler<FormValores> = async (datos) => {
    try {
      const respuesta = await fetch(
       `${import.meta.env.VITE_BACKEND_URL}/api/usuario/registro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            password: datos.contrasenia,
          }),
        },
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo registrar",
          text: resultado.mensaje || "Error al registrar usuario.",
          confirmButtonText: "Entendido",
          background: "#0b132b",
          color: "#ffffff",
          confirmButtonColor: "#22c55e",
          iconColor: "#ef4444",
        });

        return;
      }

      console.log("Usuario registrado:", resultado);

      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: resultado.mensaje || "Revisá tu email para verificar tu cuenta.",
        confirmButtonText: "Continuar",
        background: "#0b132b",
        color: "#ffffff",
        confirmButtonColor: "#22c55e",
        iconColor: "#22c55e",
      });

      navigate("/verificar-email", {
        state: {
          email: datos.email,
        },
      });
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-400">
          Crear Cuenta
        </h2>

        <form
          onSubmit={handleSubmit(alEnviar)}
          className="space-y-4"
          noValidate
        >
          {/* Campo: Nombre Completo */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">
              Nombre Completo
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${errors.nombre ? "border-red-500" : "border-slate-700 focus:ring-green-500"} focus:outline-none focus:ring-2`}
              {...register("nombre", {
                required: "El nombre es obligatorio.",
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres.",
                },
              })}
            />
            {errors.nombre && (
              <p className="text-red-400 text-xs mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">
              Apellido
            </label>

            <input
              type="text"
              placeholder="Pérez"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${
                errors.apellido
                  ? "border-red-500"
                  : "border-slate-700 focus:ring-green-500"
              } focus:outline-none focus:ring-2`}
              {...register("apellido", {
                required: "El apellido es obligatorio.",
                minLength: {
                  value: 2,
                  message: "Debe tener al menos 2 caracteres.",
                },
              })}
            />

            {errors.apellido && (
              <p className="text-red-400 text-xs mt-1">
                {errors.apellido.message}
              </p>
            )}
          </div>
          {/* Campo: Correo Electrónico */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${errors.email ? "border-red-500" : "border-slate-700 focus:ring-green-500"} focus:outline-none focus:ring-2`}
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
            <label className="block text-sm font-medium mb-1 text-slate-300">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${errors.contrasenia ? "border-red-500" : "border-slate-700 focus:ring-green-500"} focus:outline-none focus:ring-2`}
              {...register("contrasenia", {
                required: "La contraseña es obligatoria.",
                minLength: { value: 6, message: "Mínimo 6 caracteres." },
              })}
            />
            {errors.contrasenia && (
              <p className="text-red-400 text-xs mt-1">
                {errors.contrasenia.message}
              </p>
            )}
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${errors.confirmarContrasenia ? "border-red-500" : "border-slate-700 focus:ring-green-500"} focus:outline-none focus:ring-2`}
              {...register("confirmarContrasenia", {
                required: "Debes confirmar tu contraseña.",
                validate: (valor) =>
                  valor === contraseniaValue || "Las contraseñas no coinciden.",
              })}
            />
            {errors.confirmarContrasenia && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmarContrasenia.message}
              </p>
            )}
          </div>

          {/* Botón Registrarse */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-slate-950 font-bold p-3 rounded-lg transition duration-200 mt-2 shadow-lg shadow-green-500/20"
          >
            Registrarse
          </button>
        </form>

{/* Divisor estético */}
<div className="relative flex py-2 items-center mt-6">
  <div className="grow border-t border-slate-800/80"></div>
  <span className="shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
    O registrarse con
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
    title="Registrarse con Google"
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
    title="Registrarse con Facebook"
  >
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://w3.org">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
    <span>Facebook</span>
  </a>
</div>

{/* Enlace cruzado de vuelta al login */}
<div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-800/60 mt-4">
  ¿Ya tienes una cuenta registrada en el sistema?{" "}
  <button 
    type="button"
    onClick={() => navigate('/login')} 
    className="text-green-400 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline ml-1 text-xs"
  >
    Inicia sesión acá
  </button>
</div>

      </div>
    </div>
  );
}
