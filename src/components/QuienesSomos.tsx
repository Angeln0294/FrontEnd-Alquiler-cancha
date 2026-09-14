import type { JSX } from 'react';
import fotoFatima from '../assets/Nosotros/Fatima-Alfaro.jpeg'
import fotoAbel from '../assets/Nosotros/Abel-Almaraz.jpeg'
import fotoAngel from '../assets/Nosotros/Angel-Nader.jpg'

export interface MiembroEquipo {
  id: number;
  nombre: string;
  rol: string;
  imagen: string;
  bio: string;
}

export default function QuienesSomos(): JSX.Element {
  
  const equipo: MiembroEquipo[] = [
    { 
      id: 1, 
      nombre: "Fatima Alfaro", 
      rol: "UI/UX Designer & Dev",
      imagen: fotoFatima, 
      bio: "Creador de la identidad visual de Canchas Ya y del maquetado asimétrico adaptativo." 
    },
    { 
      id: 2, 
      nombre: "Abel Almaraz", 
      rol: "FullStack Engineer", 
      imagen: fotoAbel, 
      bio: "Encargado de la arquitectura de la base de datos y la sincronización de reservas en tiempo real." 
    },
    { 
      id: 3, 
      nombre: "Angel Nader",
      rol: "Lead FrontEnd Developer",
      imagen: fotoAngel, 
      bio: "Especialista en React, TypeScript estricto y enrutamiento dinámico en entornos modulares"
    }
  ];
  return (
    <div className="w-full bg-[#0b132b] text-white min-h-screen py-16 px-6 md:px-12 font-sans animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* 🏟️ BLOQUE 1: HISTORIA / MISIÓN */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
            NUESTRA HISTORIA
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            ¿Qué es <span className="text-green-400">Canchas Ya</span>?
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed pt-2">
            Nacimos con el objetivo de digitalizar el deporte amateur en Tucumán. Queremos eliminar las fricciones al reservar una cancha de fútbol permitiendo a los complejos gestionar sus espacios de forma automatizada y a los jugadores asegurar su hora de juego al instante, con promos dinámicas y disponibilidad transparente.
          </p>
        </section>

        {/* 👥 BLOQUE 2: EL EQUIPO (GRILLA DE TARJETAS ASIMÉTRICA) */}
        <section className="space-y-8">
          <h3 className="text-xl font-bold tracking-wide text-white border-b border-slate-800 pb-4 text-center md:text-left">
            El Equipo Detrás del <span className="text-green-400">Código</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipo.map((miembro) => (
              <div 
                key={miembro.id} 
                className="bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col items-center p-6 text-center hover:scale-[1.02] hover:border-slate-700 transition-all duration-300"
              >
                {/* Contenedor de la foto de perfil estilizado */}
               <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-green-400/30 p-1 bg-[#0b132b] flex items-center justify-center shrink-0">
        <img 
          src={miembro.imagen} 
          alt={miembro.nombre} 
          className="w-full h-full object-cover rounded-full aspect-square" 
        />
      </div>

                <h4 className="text-lg font-black text-white">{miembro.nombre}</h4>
                <span className="text-xs text-green-400 font-bold uppercase tracking-wider mt-1 mb-3">
                  {miembro.rol}
                </span>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                  {miembro.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
