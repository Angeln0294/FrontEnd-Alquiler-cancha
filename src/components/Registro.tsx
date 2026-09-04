import { useForm } from 'react-hook-form'; 
import type { SubmitHandler } from 'react-hook-form'; // Importación estricta de tipo requerida por verbatimModuleSyntax

// 1. Estructura fuertemente tipada de los campos de tu formulario
interface FormValores {
  nombre: string;
  email: string;
  contrasenia: string;
  confirmarContrasenia: string;
}

export default function Registro() {
  // 2. Pasamos el tipo genérico <FormValores> a useForm
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormValores>({
    mode: "onTouched" 
  });

  // 3. TypeScript sabe automáticamente que contraseniaValue es un string
  const contraseniaValue = watch("contrasenia");

  // 4. Usamos SubmitHandler para tipar de forma segura la función alEnviar
  const alEnviar: SubmitHandler<FormValores> = (datos) => {
    console.log("¡Éxito! Datos recolectados:", datos);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-400">Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit(alEnviar)} className="space-y-4" noValidate>
          
          {/* Campo: Nombre Completo */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Nombre Completo</label>
            <input
              type="text"
              placeholder="Juan Pérez"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${errors.nombre ? 'border-red-500' : 'border-slate-700 focus:ring-green-500'} focus:outline-none focus:ring-2`}
              {...register("nombre", { 
                required: "El nombre es obligatorio.",
                minLength: { value: 3, message: "Debe tener al menos 3 caracteres." }
              })}
            />
            {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          {/* Campo: Correo Electrónico */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Correo Electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700 focus:ring-green-500'} focus:outline-none focus:ring-2`}
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
            <label className="block text-sm font-medium mb-1 text-slate-300">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${errors.contrasenia ? 'border-red-500' : 'border-slate-700 focus:ring-green-500'} focus:outline-none focus:ring-2`}
              {...register("contrasenia", { 
                required: "La contraseña es obligatoria.",
                minLength: { value: 6, message: "Mínimo 6 caracteres." }
              })}
            />
            {errors.contrasenia && <p className="text-red-400 text-xs mt-1">{errors.contrasenia.message}</p>}
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 rounded-lg bg-slate-800 border ${errors.confirmarContrasenia ? 'border-red-500' : 'border-slate-700 focus:ring-green-500'} focus:outline-none focus:ring-2`}
              {...register("confirmarContrasenia", { 
                required: "Debes confirmar tu contraseña.",
                validate: valor => valor === contraseniaValue || "Las contraseñas no coinciden."
              })}
            />
            {errors.confirmarContrasenia && <p className="text-red-400 text-xs mt-1">{errors.confirmarContrasenia.message}</p>}
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
        <div className="relative flex py-5 items-center">
            <div className="grow border-t border-slate-800"></div>
            <span className="shrink mx-4 text-slate-500 text-xs uppercase tracking-wider">O registrarse con</span>
            <div className="grow border-t border-slate-800"></div>
        </div>

        {/* Botones Sociales */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 transition text-sm">
            <span>Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 transition text-sm">
            <span>Facebook</span>
          </button>
        </div>

      </div>
    </div>
  );
}
