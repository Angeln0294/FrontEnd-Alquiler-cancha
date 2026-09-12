import { useCarrito } from "../context/CarritoContext";

export default function Carrito() {
  const {
    carrito,
    cargando,
    restarCantidad,
    sumarCantidad,
    eliminarProducto,
    vaciarCarrito,
    pagarCarrito,
    cantidadTotal,
    precioTotal,
  } = useCarrito();

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Cargando carrito...
      </div>
    );
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="text-6xl mb-5">🛒</div>

          <h1 className="text-3xl font-black">Tu carrito está vacío</h1>

          <p className="text-slate-400 mt-3">
            Agregá productos desde nuestra tienda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Mi carrito 🛒</h1>

        <div className="space-y-4">
          {carrito.items
            .filter((item) => item.producto)
            .map((item) => (
              <div
                key={item.producto._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
              >
                {/* IMAGEN */}

                <img
                  src={item.producto.imagen}
                  alt={item.producto.nombreProducto}
                  className="w-24 h-24 object-cover rounded-xl"
                />

                {/* PRODUCTO */}

                <div className="flex-1">
                  <h2 className="font-bold text-lg">
                    {item.producto.nombreProducto}
                  </h2>

                  <p className="text-green-400 font-bold mt-1">
                    ${item.producto.precio}
                  </p>
                </div>

                {/* CANTIDAD */}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => restarCantidad(item.producto._id)}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700"
                  >
                    −
                  </button>

                  <span className="font-bold">{item.cantidad}</span>

                  <button
                    type="button"
                    onClick={() => sumarCantidad(item.producto._id)}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>

                {/* SUBTOTAL */}

                <div className="text-right">
                  <p className="font-black text-lg">
                    ${item.producto.precio * item.cantidad}
                  </p>

                  <button
                    type="button"
                    onClick={() => eliminarProducto(item.producto._id)}
                    className="text-red-400 text-sm mt-2 hover:text-red-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* RESUMEN */}

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between text-slate-400">
            <span>Productos</span>
            <span>{cantidadTotal}</span>
          </div>

          <div className="border-t border-slate-800 my-4" />

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total</span>

            <span className="text-3xl font-black text-green-400">
              ${precioTotal}
            </span>
          </div>

          <button
            type="button"
            onClick={vaciarCarrito}
            className="mt-6 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/20 transition"
          >
            Vaciar carrito
          </button>

          <button
            type="button"
            onClick={pagarCarrito}
            className="mt-4 w-full px-5 py-3 rounded-xl bg-green-500 text-slate-950 font-bold hover:bg-green-400 transition"
          >
            Pagar con Mercado Pago 💳
          </button>
        </div>
      </div>
    </div>
  );
}
