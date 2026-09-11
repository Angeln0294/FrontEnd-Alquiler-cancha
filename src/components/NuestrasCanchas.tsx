// src/pages/NuestrasCanchas.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export interface CanchaDetalle {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  disponible: boolean;
}
export default function NuestrasCanchas() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { usuario } = useAuth()
  const API_URL = "http://localhost:3003/api/canchas";

  const [canchas, setCanchas] = useState<CanchaDetalle[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        setCargando(true);

        const respuesta = await fetch(API_URL, {
          credentials: "include",
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            resultado.message || "No se pudieron cargar las canchas",
          );
        }

        setCanchas(resultado.canchas || []);
      } catch (error) {
        console.error("Error al cargar las canchas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarCanchas();

    const canchaParam = searchParams.get("cancha");

    if (canchaParam) {
      console.log(
        "Cancha sugerida desde la Home:",
        decodeURIComponent(canchaParam),
      );
    }
  }, [searchParams]);

  // Dentro de src/components/NuestrasCanchas.tsx
 
  if (cargando) {
    return (
      <div className="w-full bg-[#0b132b] text-white min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Cargando canchas...</p>
      </div>
    );
  }
  return (
    <div className="w-full bg-[#0b132b] text-white min-h-screen py-12 px-6 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center">
          Nuestras <span className="text-green-400">Canchas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {canchas.map((cancha) => (
            <div
              key={cancha._id}
              className="bg-[#1e293b] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300"
            >
              <div className="h-44 w-full bg-slate-900 overflow-hidden relative">
                <img
                  src={cancha.imagen}
                  alt={cancha.nombre}
                  className="w-full h-full object-cover opacity-80"
                />
                <span className="absolute top-4 left-4 bg-[#0b132b]/90 text-green-400 text-xs font-bold px-3 py-1 rounded-lg border border-gray-800">
                  {cancha.tipo}
                </span>
              </div>
              <div className="p-5 grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">{cancha.nombre}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">
                    {cancha.descripcion}
                  </p>
                </div>
                <div className="border-t border-gray-800/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      Precio por hora
                    </span>
                    <span className="text-lg font-black text-green-400">
                      {" "}
                      ${cancha.precio.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!usuario) {
                        navigate("/login");
                        return;
                      }

                      navigate(
                        `/reservar-turnos?cancha=${encodeURIComponent(cancha.nombre)}&precio=${encodeURIComponent(cancha.precio)}`,
                      );
                    }}
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
