// 📋 Definimos la interfaz estricta para el tipado de cada producto
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: string;
  imagen: string;
}

export default function Tienda() {
  // 🟢 Tipamos fuertemente el array de productos de la tienda
  const productos: Producto[] = [
    { 
      id: 1,
      nombre: "Pelota de Fútbol F5 Pro", 
      categoria: "Accesorios", 
      precio: "$15.000", 
      imagen: "https://unsplash.com" // 💡 Ajusté la URL de Unsplash para evitar imágenes rotas
    },
    { 
      id: 2, 
      nombre: "Guantes de Arquero GripMax", 
      categoria: "Protección", 
      precio: "$25.000", 
      imagen: "https://unsplash.com" 
    },
    { 
      id: 3, 
      nombre: "Botines Sintéticos Elite", 
      categoria: "Calzado", 
      precio: "$45.000", 
      imagen: "https://unsplash.com" 
    },
    { 
      id: 4, 
      nombre: "Canilleras de Carbono Light", 
      categoria: "Protección", 
      precio: "$15.600", 
      imagen: "https://unsplash.com" 
    },
    { 
      id: 5, 
      nombre: "Inflador de Mano Alta Presión", 
      categoria: "Accesorios", 
      precio: "$9.800", 
      imagen: "https://unsplash.com" 
    },
    { 
      id: 6, 
      nombre: "Medias de Compresión Pro", 
      categoria: "Indumentaria", 
      precio: "$7.400", 
      imagen: "https://unsplash.com" 
    },
    { 
      id: 7,
      nombre: "Silbato de Árbitro Fox", 
      categoria: "Accesorios", 
      precio: "$5.300", 
      imagen: "https://unsplash.com" 
    },
    { 
     id: 8, 
     nombre: "Cinta de Capitán Elástica", 
     categoria: "Accesorios", 
     precio: "$3.900", 
     imagen: "https://unsplash.com" 
    },
    { 
     id: 9, 
     nombre: "Bolso Porta Pelotas Reforzado", 
     categoria: "Accesorios", 
     precio: "$29.100", 
     imagen: "https://unsplash.com" 
    }
  ];

  return (
    <section className="w-full bg-[#0b132b] py-16 px-6 md:px-12 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight">
          Nuestra <span className="text-green-400">Tienda</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto) => (
            <div 
              key={producto.id} 
              className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 flex flex-col justify-between items-center text-center shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-full h-44 flex items-center justify-center overflow-hidden bg-gray-900/40 rounded-xl mb-4 p-4">
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre} 
                  className="max-h-full max-w-full object-cover rounded-lg" 
                />
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
                onClick={() => alert(`Añadiste "${producto.nombre}"`)} 
                className="w-full bg-green-500 hover:bg-green-600 text-[#0b132b] font-black py-2.5 rounded-xl transition-colors text-sm tracking-wide shadow-md shadow-green-500/10 cursor-pointer"
              >
                AGREGAR AL CARRITO
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
