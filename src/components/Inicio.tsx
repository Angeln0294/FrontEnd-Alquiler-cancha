import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProductos } from "../context/ProductoContext";
import { useCarrito } from "../context/CarritoContext";
import { CanchaCard } from "./NuestrasCanchas/CanchasCard";
import Swal from "sweetalert2";
import { ProductoCard } from "../components/ProductoCard";

interface Anuncio {
  id: number;
  titulo: string;
  subtitulo: string;
  descuento: string;
  colorBg: string;
}

interface Cancha {
  _id: string;
  nombre: string;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  precio: number;
  imagen: string;
  descripcion: string;
  disponible: boolean;
}

export default function Inicio() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { productos ,cargarProductos, limiteProductos } = useProductos();
  const { agregarAlCarrito } = useCarrito();
  // 🔘 Estado para controlar el carrusel de anuncios publicitarios
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [cargandoCanchas, setCargandoCanchas] = useState(true);

  const anuncios: Anuncio[] = [
    {
      id: 1,
      titulo: "¡Promo Nocturna!",
      subtitulo: "Reservá de Lunes a Jueves después de las 22:00hs",
      descuento: "20% OFF",
      colorBg: "from-green-600 to-emerald-900",
    },
    {
      id: 2,
      titulo: "Torneo Relámpago Canchas Ya",
      subtitulo: "Inscripciones abiertas para la copa de fin de semana",
      descuento: "Premios en efectivo",
      colorBg: "from-blue-600 to-slate-900",
    },
    {
      id: 3,
      titulo: "Escuelita de Fútbol",
      subtitulo: "Planes mensuales para niños y adolescentes",
      descuento: "Matrícula Gratis",
      colorBg: "from-amber-600 to-orange-900",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % anuncios.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [anuncios.length]);

  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        setCargandoCanchas(true);

        const respuesta = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/canchas`,
          {
            credentials: "include",
          },
        );

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
        setCargandoCanchas(false);
      }
    };

    cargarCanchas();
  }, []);
  
  useEffect(() => {
  cargarProductos(1, "", limiteProductos);
}, [cargarProductos, limiteProductos]);

  return (
    <div className="w-full bg-[#0b132b] text-white min-h-screen pb-16">
      <div className="w-full px-6 md:px-12 pt-8 max-w-7xl mx-auto">
        <div
          className={`w-full rounded-3xl bg-linear-to-r ${anuncios[currentSlide].colorBg} p-8 md:p-12 relative overflow-hidden shadow-2xl transition-all duration-700 ease-in-out border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 min-h-55`}
        >
          <div className="flex flex-col gap-3 text-center md:text-left max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest text-green-400 bg-black/30 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
              PROMO EXCLUSIVA
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">
              {anuncios[currentSlide].titulo}
            </h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              {anuncios[currentSlide].subtitulo}
            </p>
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
                className={`w-2.5 h-2.5 rounded-full transition-colors ${currentSlide === idx ? "bg-green-400" : "bg-gray-500/50"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="w-full px-6 md:px-12 pt-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Reserva tu{" "}
            <span className="text-green-400">Cancha al Instante</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Selecciona tu complejo preferido y asegura tu hora de juego.
          </p>
        </div>

        
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {cargandoCanchas ? (
    <div className="col-span-full text-center py-10">
      <p className="text-gray-400 text-lg">
        Cargando canchas...
      </p>
    </div>
  ) : canchas.filter((cancha) => cancha.disponible).length === 0 ? (
    <div className="col-span-full text-center py-10">
      <p className="text-gray-400 text-lg">
        No hay canchas disponibles en este momento.
      </p>
    </div>
  ) : (
    canchas
      .filter((cancha) => cancha.disponible)
      .slice(0, 3)
      .map((cancha) => (
        <CanchaCard
          key={cancha._id}
          cancha={cancha}
          onReservar={(canchaSeleccionada) => {
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
                canchaSeleccionada._id
              )}&cancha=${encodeURIComponent(
                canchaSeleccionada.nombre
              )}&precio=${encodeURIComponent(
                canchaSeleccionada.precio
              )}&imagen=${encodeURIComponent(
                canchaSeleccionada.imagen
              )}`
            );
          }}
        />
      ))
  )}
</div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate("/nuestras-canchas")}
            className="text-green-400 hover:text-green-300 text-1xl font-bold transition-colors cursor-pointer"
            aria-label="Ir a nuestras canchas"
          >
            Ver más &gt;
          </button>
        </div>
      </section>

      <section className="w-full px-6 md:px-12 pt-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Equipamiento <span className="text-green-400">Destacado</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Todo lo que necesitás para tu partido, directo a la cancha.
          </p>
        </div>

        
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {productos.slice(0, 3).map((producto) => (
    <ProductoCard
      key={producto._id}
      producto={producto}
      onAgregarAlCarrito={async (productoSeleccionado) => {
        if (!usuario) {
          const resultado = await Swal.fire({
            icon: "warning",
            title: "Iniciá sesión",
            text: "Debés iniciar sesión para poder agregar productos al carrito.",
            confirmButtonText: "Iniciar sesión",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#22c55e",
          });

          if (resultado.isConfirmed) {
            navigate("/login");
          }

          return;
        }

        await agregarAlCarrito(productoSeleccionado._id);

        const resultado = await Swal.fire({
          icon: "success",
          title: "¡Producto agregado!",
          text: `${productoSeleccionado.nombreProducto} fue agregado al carrito.`,
          background: "#1e293b",
          color: "#ffffff",
          showCancelButton: true,
          confirmButtonText: "🛒 Ver carrito",
          cancelButtonText: "Seguir comprando",
          confirmButtonColor: "#00d26a",
          cancelButtonColor: "#00d26a",
          reverseButtons: true,
        });

        if (resultado.isConfirmed) {
          navigate("/carrito");
        }
      }}
    />
  ))}
</div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate("/tienda")}
            className="text-green-400 hover:text-green-300 text-1xl font-bold transition-colors cursor-pointer"
            aria-label="Ir a la tienda"
          >
            Ver más &gt;
          </button>
        </div>
      </section>
    </div>
  );
}
