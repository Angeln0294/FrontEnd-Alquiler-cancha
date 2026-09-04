import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form'; // REGLA STRICT: Importación explícita de tipo

// 1. Estructura fuertemente tipada de los campos de inicio de sesión
interface LoginValores {
  email: string;
  contrasenia: string;
}

export default function Login() {
  // 2. Pasamos la interfaz LoginValores como tipo genérico a useForm
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginValores>({
    mode: "onTouched" 
  });

  // 3. Tipamos la función usando SubmitHandler con nuestra interfaz
  const alEnviar: SubmitHandler<LoginValores> = async (datos) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Credenciales capturadas correctamente:", datos);
    alert("¡Sesión iniciada con éxito! (Simulación)");
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#0b132b] flex items-center justify-center p-6 text-white">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        
        {/* Cabecera del formulario */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl mx-auto mb-2 shadow-lg shadow-green-500/20">
            ⚽
          </div>
          <h2 className="text-2xl font-bold text-gray-100">¡Bienvenido de nuevo!</h2>
          <p className="text-gray-400 text-xs mt-1">Iniciá sesión para reservar tus canchas favoritas</p>
        </div>

        {/* Formulario conectado a handleSubmit */}
        <form onSubmit={handleSubmit(alEnviar)} className="space-y-4" noValidate>
          
          {/* Campo: Correo Electrónico */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Correo Electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              disabled={isSubmitting} 
              className={`w-full p-3 rounded-lg bg-slate-800 border ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-green-500'
              } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50`}
              {...register("email", { 
                required: "El correo es obligatorio.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "El formato de correo no es válido."
                }
              })}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Campo: Contraseña */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-300">Contraseña</label>
              <a href="#recuperar" className="text-xs text-green-400 hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full p-3 rounded-lg bg-slate-800 border ${
                errors.contrasenia ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-green-500'
              } focus:outline-none focus:ring-2 transition-colors disabled:opacity-50`}
              {...register("contrasenia", { 
                required: "La contraseña es obligatoria.",
                minLength: { value: 6, message: "La contraseña debe tener mínimo 6 caracteres." }
              })}
            />
            {errors.contrasenia && <p className="text-red-400 text-xs mt-1">{errors.contrasenia.message}</p>}
          </div>

          {/* Botón de Ingreso con Spinner */}
          <button
            type="submit"
            disabled={isSubmitting} 
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700 text-slate-950 font-bold p-3 rounded-lg transition duration-200 mt-2 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Validando acceso...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

        {/* Divisor estético */}
        <div className="relative flex py-5 items-center">
          <div className="grow border-t border-slate-800"></div>
          <span className="shrink mx-4 text-slate-500 text-xs uppercase tracking-wider">O continuar con</span>
          <div className="grow border-t border-slate-800"></div>
        </div>

        {/* Cuadrícula de Botones Sociales */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button 
            type="button"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 transition text-sm font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-gray-200"
          >
            <span>Google</span>
          </button>

          <button 
            type="button"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#1877F2] hover:bg-[#1565D8] transition text-sm font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-white shadow-lg shadow-[#1877F2]/10"
          >
            <span>Facebook</span>
          </button>
        </div>

      </div>
    </div>
  );
}
