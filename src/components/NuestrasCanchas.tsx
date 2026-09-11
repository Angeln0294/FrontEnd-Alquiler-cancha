// src/pages/NuestrasCanchas.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate} from 'react-router-dom';

export interface CanchaDetalle {
  id: number;
  nombre: string;
  tipo: string; 
  superficie: string;
  precioHora: string;
  imagen: string;
  descripcion: string;
}

export default function NuestrasCanchas() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const canchas: CanchaDetalle[] = [
    { id: 1, nombre: "Camp Nou Tucumano", tipo: "Fútbol 5", superficie: "Césped Sintético", precioHora: "$12.000", imagen: "https://unsplash.com", descripcion: "Césped sintético premium con iluminación LED profesional." },
    { id: 2, nombre: "La Bombonerita", tipo: "Fútbol 5", superficie: "Parquet Techado", precioHora: "$14.000", imagen: "https://unsplash.com", descripcion: "Estadio techado ideal para días de lluvia, superficie de parquet." },
    { id: 3, nombre: "Predio Maracaná", tipo: "Fútbol 7", superficie: "Césped Natural", precioHora: "$18.000", imagen: "https://unsplash.com", descripcion: "Cancha amplia de césped natural para partidos de 7 contra 7." },
    { id: 4, nombre: "Wembley del Norte", tipo: "Fútbol 11", superficie: "Césped Natural", precioHora: "$25.000", imagen: "https://unsplash.com", descripcion: "Terreno profesional de once ideal para torneos grandes y competitivos." },
    { id: 5, nombre: "Anfield Stadium", tipo: "Fútbol 7", superficie: "Césped Sintético", precioHora: "$19.000", imagen: "https://unsplash.com", descripcion: "Sintético reforzado de alta resistencia con iluminación perimetral." },
    { id: 6, nombre: "Santiago Bernabéu", tipo: "Fútbol 5", superficie: "Goma Techada", precioHora: "$15.000", imagen: "https://unsplash.com", descripcion: "Pista rápida techada con amortiguación premium contra impactos." },
    { id: 7, nombre: "San Siro del NOA", tipo: "Fútbol 7", superficie: "Césped Sintético", precioHora: "$18.500", imagen: "https://unsplash.com", descripcion: "Excelente drenaje dinámico para mantener el ritmo de juego alto." },
    { id: 8, nombre: "Old Trafford Tucma", tipo: "Fútbol 11", superficie: "Césped Mixto", precioHora: "$27.000", imagen: "https://unsplash.com", descripcion: "Tecnología híbrida de césped para pisadas firmes y gran amortiguación." },
    { id: 9, nombre: "La Fortaleza", tipo: "Fútbol 5", superficie: "Césped Sintético", precioHora: "$13.000", imagen: "https://unsplash.com", descripcion: "Cancha clásica de 5 con cercado reforzado, ideal para partidos intensos." }
  ];

  useEffect(() => {
    const canchaParam = searchParams.get('cancha');
    if (canchaParam) {
      console.log("Cancha sugerida desde la Home:", decodeURIComponent(canchaParam));
    }
  }, [searchParams]);

 // Dentro de src/components/NuestrasCanchas.tsx
const handleReservar = (nombreCancha: string, precio: string) => {
  // 🚀 Ahora mandamos el nombre Y el precio por la URL
  navigate(`/reservar-turnos?cancha=${encodeURIComponent(nombreCancha)}&precio=${encodeURIComponent(precio)}`);
};

  return (
    <div className="w-full bg-[#0b132b] text-white min-h-screen py-12 px-6 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-center">
          Nuestras <span className="text-green-400">Canchas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {canchas.map((cancha) => (
            <div key={cancha.id} className="bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
              <div className="h-44 w-full bg-slate-900 overflow-hidden relative">
                <img src={cancha.imagen} alt={cancha.nombre} className="w-full h-full object-cover opacity-80" />
                <span className="absolute top-4 left-4 bg-[#0b132b]/90 text-green-400 text-xs font-bold px-3 py-1 rounded-lg border border-gray-800">{cancha.tipo}</span>
              </div>
              <div className="p-5 grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">{cancha.nombre}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{cancha.descripcion}</p>
                </div>
                <div className="border-t border-gray-800/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Precio por hora</span>
                    <span className="text-lg font-black text-green-400">{cancha.precioHora}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleReservar(cancha.nombre, cancha.precioHora)}
                    className="font-black px-5 py-2.5 rounded-xl text-xs bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-[#0b132b] cursor-pointer transition-colors"
                  >
                    RESERVAR CANCHA
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

