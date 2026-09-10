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
        {/* Aquí irá el catálogo en el próximo commit */}
      </div>
    </div>
  );
}
