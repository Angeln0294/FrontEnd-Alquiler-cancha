import {useState} from 'react';

export interface CanchaDetalle{
    id: number;
    nombre: string;
    tipo: string //futbol 5, futbol 7, etc
    superficie: string;
    precioHora: string;
    imagen: string;
    descripcion: string;
}

export interface HorarioTurno {
    hora: string;
    disponible: boolean;
}

export default function NuestrasCanchas(){
    const canchas: CanchaDetalle[]= [
        { 
            id: 1, 
            nombre: "Camp Nou Tucumano", 
            tipo: "Fútbol 5", 
            superficie: "Césped Sintético", 
            precioHora: "$12.000", 
            imagen: "https://unsplash.com", 
            descripcion: "Césped sintético premium con iluminación LED profesional." 
        },
        { 
            id: 2, 
            nombre: "La Bombonerita", 
            tipo: "Fútbol 5", 
            superficie: "Parquet Techado", 
            precioHora: "$14.000", 
            imagen: "https://unsplash.com", 
            descripcion: "Estadio techado ideal para días de lluvia, superficie de parquet." 
        },
        { 
            id: 3, 
            nombre: "Predio Maracaná", 
            tipo: "Fútbol 7", 
            superficie: "Césped Natural", 
            precioHora: "$18.000", 
            imagen: "https://unsplash.com", 
            descripcion: "Cancha amplia de césped natural para partidos de 7 contra 7." 
        }
    ];

     return (
    <div className="w-full bg-[#0b132b] text-white min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Nuestras <span className="text-green-400">Canchas</span>
        </h2>

        {/* 🎨 GRILLA DE TARJETAS ADAPTATIVA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {canchas.map((cancha) => (
            <div 
              key={cancha.id} 
              className="bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
            >
              {/* Imagen y Badge superior */}
              <div className="h-48 w-full bg-slate-900 overflow-hidden relative">
                <img src={cancha.imagen} alt={cancha.nombre} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-[#0b132b]/90 text-green-400 text-xs font-bold px-3 py-1 rounded-lg border border-gray-800">
                  {cancha.tipo}
                </span>
              </div>

              {/* Información de la cancha */}
              <div className="p-6 grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{cancha.nombre}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{cancha.descripcion}</p>
                  <p className="text-xs text-gray-400 font-medium mb-4">
                    🌱 Superficie: <span className="text-gray-200">{cancha.superficie}</span>
                  </p>
                </div>

                {/* Precio y Botón de Acción */}
                <div className="border-t border-gray-800/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Precio por hora</span>
                    <span className="text-xl font-black text-green-400">{cancha.precioHora}</span>
                  </div>
                  <button 
                    type="button" 
                    className="bg-green-500 hover:bg-green-600 text-[#0b132b] font-black px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    VER DISPONIBILIDAD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

