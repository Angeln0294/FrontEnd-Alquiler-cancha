import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PaginadorBackend } from "../components/Paginador";
import { usePaginacionBackend } from "../context/PaginacionContext";
import { CanchaCard } from "../components/CanchasCard";
import Swal from "sweetalert2";

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
  const { usuario } = useAuth();

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/canchas`;

  const [canchas, setCanchas] = useState<CanchaDetalle[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cantidad de canchas que se muestran por página
  const canchasPorPagina = 6;

  // El componente PaginadorBackend se encarga de cambiar la página
  const { paginaActual, setCantidadPaginas } =
    usePaginacionBackend("canchas");

  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        setCargando(true);

        const respuesta = await fetch(
          `${API_URL}?pagina=${paginaActual}&limite=${canchasPorPagina}`,
          {
            credentials: "include",
          },
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            resultado.mensaje ||
              resultado.message ||
              "No se pudieron cargar las canchas",
          );
        }

        setCanchas(resultado.canchas || []);

        // Le informamos al contexto cuántas páginas existen
        setCantidadPaginas(
          resultado.totalPaginas ||
            Math.ceil(
              (resultado.cantidadCanchas || 0) / canchasPorPagina,
            ),
        );
      } catch (error) {
        console.error("Error al cargar las canchas:", error);

        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las canchas.",
          confirmButtonText: "Entendido",
          background: "#0b132b",
          color: "#ffffff",
          confirmButtonColor: "#22c55e",
        });
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
  }, [paginaActual, searchParams]);

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
    <CanchaCard
      key={cancha._id}
      cancha={cancha}
      onReservar={(cancha) => {
        if (!usuario) {
          Swal.fire({
            icon: "warning",
            title: "Iniciá sesión",
            text: "Debés iniciar sesión para poder reservar una cancha.",
            confirmButtonText: "Iniciar sesión",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#22c55e",
          }).then((resultado) => {
            if (resultado.isConfirmed) {
              navigate("/login");
            }
          });

          return;
        }

        navigate(
          `/reservar-turnos?canchaId=${encodeURIComponent(
            cancha._id,
          )}&cancha=${encodeURIComponent(
            cancha.nombre,
          )}&precio=${encodeURIComponent(
            cancha.precio,
          )}&imagen=${encodeURIComponent(
            cancha.imagen,
          )}`,
        );
      }}
    />
  ))}
</div>

        {/* Paginador reutilizable */}
        <div className="border-t border-slate-700 p-4">
          <PaginadorBackend seccion="canchas" />
        </div>

      </div>
    </div>
  );
}

