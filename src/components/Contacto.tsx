import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

// 📋 Definimos la estructura estricta de los campos del formulario
interface ContactInputs {
  nombre: string;
  email: string;
  mensaje: string;
}

export default function Contacto() {
  // 🛠️ Inicializamos React Hook Form con nuestro tipo estricto
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactInputs>({
    defaultValues: {
      nombre: '',
      email: '',
      mensaje: ''
    }
  });

  // 🚀 Manejador de envío tipado correctamente
  const onSubmit: SubmitHandler<ContactInputs> = (data) => {
    // Aquí conectarás la lógica de envío o API más adelante
    alert(`¡Gracias por tu mensaje, ${data.nombre}! Nos comunicaremos pronto.`);
    reset(); // Limpia el formulario
  };

  return (
    <section id="contacto" className="w-full bg-[#0f172a] py-16 px-6 md:px-12 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Título de la Sección */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight">
          Ponte en <span className="text-green-400">Contacto</span>
        </h2>

        {/* Contenedor de Dos Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Columna Izquierda: Información de Atención */}
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">¿Tienes alguna duda?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Escríbenos si quieres organizar un torneo, celebrar un cumpleaños o consultar sobre planes mensuales para escuelas de fútbol. Nuestro equipo te responderá en menos de 24 horas.
              </p>
            </div>

            {/* Datos de contacto */}
            <div className="flex flex-col gap-6 text-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 text-lg">📍</div>
                <div>
                  <h4 className="font-bold text-white">Dirección</h4>
                  <p className="text-gray-400 text-xs">Av. del Deporte 1420, San Miguel de Tucumán</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 text-lg">📞</div>
                <div>
                  <h4 className="font-bold text-white">Teléfono / WhatsApp</h4>
                  <p className="text-gray-400 text-xs">+54 (381) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 text-lg">✉️</div>
                <div>
                  <h4 className="font-bold text-white">Correo Electrónico</h4>
                  <p className="text-gray-400 text-xs">soporte@canchasya.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              
              {/* Campo Nombre */}
              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre Completo</label>
                <input 
                  type="text" 
                  id="nombre"
                  placeholder="Ej. Juan Pérez" 
                  className={`w-full bg-[#0b132b] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                    errors.nombre ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-green-500'
                  }`}
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                />
                {errors.nombre && <span className="text-red-400 text-xs mt-1">{errors.nombre.message}</span>}
              </div>

              {/* Campo Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="juan@email.com" 
                  className={`w-full bg-[#0b132b] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-green-500'
                  }`}
                  {...register('email', { 
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Formato de correo inválido'
                    }
                  })}
                />
                {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email.message}</span>}
              </div>

              {/* Campo"> Tu Mensaje */}
              <div className="flex flex-col gap-2">
                <label htmlFor="mensaje" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tu Mensaje</label>
                <textarea 
                  id="mensaje" 
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?" 
                  className={`w-full bg-[#0b132b] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors resize-none ${
                    errors.mensaje ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-green-500'
                  }`}
                  {...register('mensaje', { required: 'El mensaje no puede estar vacío' })}
                ></textarea>
                {errors.mensaje && <span className="text-red-400 text-xs mt-1">{errors.mensaje.message}</span>}
              </div>

              {/* Botón Enviar */}
              <button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-[#0b132b] font-black py-3 rounded-xl transition-colors text-sm tracking-wide mt-2 shadow-md shadow-green-500/10"
              >
                ENVIAR MENSAJE
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
