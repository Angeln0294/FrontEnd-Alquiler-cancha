import { useState } from 'react';

// 📋 1. Interfaces para TypeScript Estricto
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: string;
  imagen: string;
}

interface CartItem extends Producto {
  cantidad: number;
}

interface TiendaProps {
  carrito: CartItem[];
  agregarAlCarrito: (producto: Producto) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  actualizarCantidad: (id: number, incremento: number) => void;
  eliminarDelCarrito: (id: number) => void;
}

export default function Tienda({
  carrito,
  agregarAlCarrito,
  isCartOpen,
  setIsCartOpen,
  actualizarCantidad,
  eliminarDelCarrito
}: TiendaProps) {
  // 🔘 2. Estados de Filtros internos
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 🛍️ 3. Catálogo estático de productos
  const productos: Producto[] = [
    { id: 1, nombre: "Pelota de Fútbol F5 Pro", categoria: "Accesorios", precio: "$15.000", imagen: "https://unsplash.com" },
    { id: 2, nombre: "Guantes de Arquero GripMax", categoria: "Protección", precio: "$25.000", imagen: "https://unsplash.com" },
    { id: 3, nombre: "Botines Sintéticos Elite", categoria: "Calzado", precio: "$45.000", imagen: "https://unsplash.com" },
    { id: 4, nombre: "Canilleras de Carbono Light", categoria: "Protección", precio: "$15.600", imagen: "https://unsplash.com" },
    { id: 5, nombre: "Inflador de Mano Alta Presión", categoria: "Accesorios", precio: "$9.800", imagen: "https://unsplash.com" },
    { id: 6, nombre: "Medias de Compresión Pro", categoria: "Indumentaria", precio: "$7.400", imagen: "https://unsplash.com" },
    { id: 7, nombre: "Silbato de Árbitro Fox", categoria: "Accesorios", precio: "$5.300", imagen: "https://unsplash.com"},
    { id: 8, nombre: "Cinta de Capitán Elástica", categoria: "Accesorios", precio: "$3.900", imagen: "https://unsplash.com" },
    { id: 9, nombre: "Bolso Porta Pelotas Reforzado", categoria: "Accesorios", precio: "$29.100", imagen: "https://unsplash.com" }
  ];

  // 🛠️ 4. Operaciones matemáticas y lógicas (Filtros y Totales)
  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];
  const productosFiltrados = categoriaSeleccionada === 'Todos' ? productos : productos.filter(p => p.categoria === categoriaSeleccionada);
  
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const precioTotal = carrito.reduce((acc, item) => {
    const numeroPrecio = Number(item.precio.replace(/[^0-9]/g, ''));
    return acc + numeroPrecio * item.cantidad;
  }, 0);

  // 🎨 5. El Renderizado de la Interfaz (JSX)
  return (
    <section className="w-full bg-[#0b132b] py-16 px-6 md:px-12 text-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Título de la Tienda y Filtro Desplegable */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Nuestra <span className="text-green-400">Tienda</span></h2>
          <div className="relative inline-block text-left w-full md:w-64">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-[#1e293b] border border-gray-800 rounded-xl px-5 py-3 text-sm font-bold text-white flex justify-between items-center hover:border-green-500 transition-colors shadow-md cursor-pointer">
              <span>Filtrar: <span className="text-green-400 ml-1">{categoriaSeleccionada}</span></span>
              <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-full rounded-xl bg-[#1e293b] border border-gray-800 shadow-2xl z-40 overflow-hidden">
                <div className="py-1">
                  {categorias.map((cat) => (
                    <button key={cat} type="button" onClick={() => { setCategoriaSeleccionada(cat); setIsOpen(false); }} className={`w-full text-left px-5 py-3 text-sm transition-colors hover:bg-green-500/10 ${categoriaSeleccionada === cat ? 'text-green-400 font-bold bg-green-500/5' : 'text-gray-300'}`}>{cat}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grilla con las Tarjetas de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 flex flex-col justify-between items-center text-center shadow-lg hover:scale-[1.02] transition-transform duration-300">
              <div className="w-full h-44 flex items-center justify-center overflow-hidden bg-gray-900/40 rounded-xl mb-4 p-4"><img src={producto.imagen} alt={producto.nombre} className="max-h-full max-w-full object-cover rounded-lg" /></div>
              <div className="w-full mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">{producto.categoria}</span>
                <h3 className="text-lg font-bold text-white mt-3 mb-1 truncate">{producto.nombre}</h3>
                <p className="text-xl font-black text-gray-200">{producto.precio}</p>
              </div>
              <button type="button" onClick={() => agregarAlCarrito(producto)} className="w-full bg-green-500 hover:bg-green-600 text-[#0b132b] font-black py-2.5 rounded-xl transition-colors text-sm tracking-wide shadow-md shadow-green-500/10 cursor-pointer">AGREGAR AL CARRITO</button>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 BOTÓN FLOTANTE FIJO ESTILO TEMU (No se mueve con el scroll) */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed right-6 bottom-24 md:right-10 md:bottom-28 bg-green-500 hover:bg-green-600 text-[#0b132b] p-4 rounded-full transition-transform hover:scale-110 active:scale-95 shadow-2xl shadow-green-500/30 cursor-pointer z-40 border border-green-400/20"
        title="Ver carrito"
      >
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        {totalItems > 0 && (
          <span className="bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold absolute -top-1 -right-1 shadow-md animate-pulse">
            {totalItems}
          </span>
        )}
      </button>

      {/* Sidebar Lateral del Carrito Desplegado */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#1e293b] h-full shadow-2xl p-6 flex flex-col justify-between border-l border-gray-800 z-50">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 className="text-xl font-black text-white">Tu Carrito</h3>
                <button type="button" onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
                {carrito.length === 0 ? <p className="text-center text-gray-400 my-12 text-sm">Tu carrito está vacío.</p> : carrito.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-[#0b132b] p-3 rounded-xl border border-gray-800 items-center justify-between">
                    <div className="w-12 h-12 bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center p-1 shrink-0"><img src={item.imagen} alt={item.nombre} className="object-cover max-h-full max-w-full rounded" /></div>
                    <div className="grow min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.nombre}</h4>
                      <p className="text-xs text-green-400 font-bold mt-0.5">{item.precio}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#1e293b] px-2 py-1 rounded-lg border border-gray-800 shrink-0">
                      <button type="button" onClick={() => actualizarCantidad(item.id, -1)} className="text-gray-400 hover:text-white text-xs font-bold px-1 cursor-pointer">-</button>
                      <span className="text-xs text-white font-bold w-4 text-center">{item.cantidad}</span>
                      <button type="button" onClick={() => actualizarCantidad(item.id, 1)} className="text-gray-400 hover:text-white text-xs font-bold px-1 cursor-pointer">+</button>
                    </div>
                    <button type="button" onClick={() => eliminarDelCarrito(item.id)} className="text-red-400 hover:text-red-300 ml-1 transition-colors cursor-pointer"><svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
                  </div>
                ))}
              </div>
            </div>
            {carrito.length > 0 && (
              <div className="border-t border-gray-800 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4"><span className="text-sm font-bold text-gray-400">Total Estimado:</span><span className="text-2xl font-black text-green-400">${precioTotal.toLocaleString('es-AR')}</span></div>
                <button type="button" onClick={() => alert('¡Checkout próximamente!')} className="w-full bg-green-500 hover:bg-green-600 text-[#0b132b] font-black py-3 rounded-xl transition-colors text-sm tracking-wide shadow-md shadow-green-500/10 cursor-pointer">INICIAR COMPRA</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
