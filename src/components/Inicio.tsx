import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 📋 Interfaces estrictas para el tipado de TypeScript
interface Anuncio {
  id: number;
  titulo: string;
  subtitulo: string;
  descuento: string;
  colorBg: string;
}

interface Cancha {
  id: number;
  nombre: string;
  tipo: string;
  superficie: string;
  precioHora: string;
  imagen: string;
}

interface ProductoDestacado {
  id: number;
  nombre: string;
  categoria: string;
  precio: string;
  imagen: string;
}

export default function Inicio() {
  const navigate = useNavigate();
  // 🔘 Estado para controlar el carrusel de anuncios publicitarios
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // 📢 Lista de las promociones del banner
  const anuncios: Anuncio[] = [
    { id: 1, titulo: "¡Promo Nocturna!", subtitulo: "Reservá de Lunes a Jueves después de las 22:00hs", descuento: "20% OFF", colorBg: "from-green-600 to-emerald-900" },
    { id: 2, titulo: "Torneo Relámpago Canchas Ya", subtitulo: "Inscripciones abiertas para la copa de fin de semana", descuento: "Premios en efectivo", colorBg: "from-blue-600 to-slate-900" },
    { id: 3, titulo: "Escuelita de Fútbol", subtitulo: "Planes mensuales para niños y adolescentes", descuento: "Matrícula Gratis", colorBg: "from-amber-600 to-orange-900" }
  ];

  // ⚽ Catálogo exclusivo con exactamente 3 canchas
  const canchas: Cancha[] = [
    { id: 1, nombre: "Camp Nou Tucumano", tipo: "Fútbol 5", superficie: "Césped Sintético", precioHora: "$12.000", imagen: "https://unsplash.com" },
    { id: 2, nombre: "La Bombonerita", tipo: "Fútbol 5", superficie: "Parquet Techado", precioHora: "$14.000", imagen: "https://unsplash.com" },
    { id: 3, nombre: "Predio Maracaná", tipo: "Fútbol 7", superficie: "Césped Natural", precioHora: "$18.000", imagen: "https://unsplash.com" }
  ];

const productosDestacados: ProductoDestacado[] = [
    { id: 1, nombre: "Botines Sintéticos Elite", categoria: "Calzado", precio: "$45.000", imagen: "https://unsplash.com" },
    { id: 2, nombre: "Pelota de Fútbol F5 Pro", categoria: "Accesorios", precio: "$15.000", imagen: "https://unsplash.com" },
    { id: 3, nombre: "Guantes de Arquero GripMax", categoria: "Protección", precio: "$25.000", imagen: "https://unsplash.com" }
  ];

  // 🔄 Efecto para rotar la publicidad automáticamente cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % anuncios.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [anuncios.length]);
  return (
    <div className="w-full bg-[#0b132b] text-white min-h-screen pb-16">
      
      {/* 📢 1. BANNER DE PUBLICIDAD ROTATIVO */}
      <div className="w-full px-6 md:px-12 pt-8 max-w-7xl mx-auto">
        <div className={`w-full rounded-3xl bg-linear-to-r ${anuncios[currentSlide].colorBg} p-8 md:p-12 relative overflow-hidden shadow-2xl transition-all duration-700 ease-in-out border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 min-h-55`}>
          
          <div className="flex flex-col gap-3 text-center md:text-left max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest text-green-400 bg-black/30 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
              PROMO EXCLUSIVA
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">{anuncios[currentSlide].titulo}</h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">{anuncios[currentSlide].subtitulo}</p>
          </div>

          <div className="flex flex-col items-center bg-black/40 border border-white/10 px-6 py-4 rounded-2xl md:rotate-6 shadow-xl shrink-0">
            <span className="text-2xl md:text-3xl font-black text-green-400 tracking-wider">
              {anuncios[currentSlide].descuento}
            </span>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {anuncios.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${currentSlide === idx ? 'bg-green-400' : 'bg-gray-500/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ⚽ 2. SECCIÓN DE RESERVAS DE CANCHAS (3 UNIDADES) */}
      <section className="w-full px-6 md:px-12 pt-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Reserva tu <span className="text-green-400">Cancha al Instante</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3">Selecciona tu complejo preferido y asegura tu hora de juego.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {canchas.map((cancha) => (
            <div 
              key={cancha.id} 
              className="bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-full h-48 bg-gray-900 overflow-hidden relative">
                <img src={cancha.imagen} alt={cancha.nombre} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-[#0b132b]/80 backdrop-blur-sm text-green-400 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-gray-800">
                  {cancha.tipo}
                </span>
              </div>

              <div className="p-6 grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-white truncate mb-2">{cancha.nombre}</h3>
                  <div className="flex flex-col gap-2 text-xs text-gray-400 font-semibold mb-6">
                    <p className="flex items-center gap-1.5">🌱 Superficie: <span className="text-gray-200">{cancha.superficie}</span></p>
                    <p className="flex items-center gap-1.5">⏱️ Duración: <span className="text-gray-200">60 minutos de juego</span></p>
                  </div>
                </div>

                <div className="border-t border-gray-800/60 pt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Precio por Hora</p>
                    <p className="text-xl font-black text-green-400">{cancha.precioHora}</p>
                  </div>
                 <button 
                    type="button" 
                    /* 🟢 RECORREGIDO: Ahora viaja derecho hacia la ruta real de tu nueva rama /reservar-turnos */
                    onClick={() => navigate(`/reservar-turnos?cancha=${encodeURIComponent(cancha.nombre)}`)}
                    className="bg-green-500 hover:bg-green-600 text-[#0b132b] font-black px-4 py-2.5 rounded-xl transition-all text-xs tracking-wide shadow-md shadow-green-500/10 cursor-pointer"
                  >
                    RESERVAR AHORA
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>
           {/* 🛍️ 3. NUEVA SECCIÓN: PRODUCTOS DESTACADOS DE LA TIENDA (3 UNIDADES) */}
      <section className="w-full px-6 md:px-12 pt-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Equipamiento <span className="text-green-400">Destacado</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3">Todo lo que necesitás para tu partido, directo a la cancha.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosDestacados.map((producto) => (
            <div 
              key={producto.id} 
              className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 flex flex-col justify-between items-center text-center shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-full h-44 flex items-center justify-center overflow-hidden bg-gray-900/40 rounded-xl mb-4 p-4">
                <img src={producto.imagen} alt={producto.nombre} className="max-h-full max-w-full object-cover rounded-lg" />
              </div>
              
              <div className="w-full mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                  {producto.categoria}
                </span>
                <h3 className="text-lg font-bold text-white mt-3 mb-1 truncate">
                  {producto.nombre}
                </h3>
                <p className="text-xl font-black text-gray-200">{producto.precio}</p>
              </div>
              
              <button 
                type="button" 
                onClick={() => alert(`Añadiste "${producto.nombre}" al carrito rápido`)} 
                className="w-full bg-green-500 hover:bg-green-600 text-[#0b132b] font-black py-2.5 rounded-xl transition-colors text-sm tracking-wide shadow-md shadow-green-500/10 cursor-pointer"
              >
                COMPRAR AHORA
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
