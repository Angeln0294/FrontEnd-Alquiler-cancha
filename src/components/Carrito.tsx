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

          <h1 className="text-3xl font-black">
            Tu carrito está vacío
          </h1>

          <p className="text-slate-400 mt-3">
            Agregá productos desde nuestra tienda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* TÍTULO */}

        <h1 className="text-4xl font-black mb-8">
          Mi carrito 🛒
        </h1>

        {/* TABLA */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">

          {/* Para que la tabla pueda desplazarse horizontalmente en pantallas chicas */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-212.5">

              {/* ENCABEZADO */}

              <thead className="bg-slate-800/60 border-b border-slate-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">
                    Producto
                  </th>

                   <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">
                    Nombre
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">
                    Descripción
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-bold text-slate-300">
                    Cantidad
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-bold text-slate-300">
                    Precio
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-bold text-slate-300">
                    Acción
                  </th>
                </tr>
              </thead>

              {/* PRODUCTOS */}

              <tbody>

                {carrito.items
                  .filter((item) => item.producto)
                  .map((item) => (
                    <tr
                      key={item.producto._id}
                      className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                    >

                      {/* PRODUCTO + IMAGEN */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">

                          <img
                            src={item.producto.imagen}
                            alt={item.producto.nombreProducto}
                            className="w-16 h-16 object-cover rounded-xl border border-slate-700"
                          />

                        </div>
                      </td>

                      {/* NOMBRE */}

                      <td className="px-6 py-5">
                        <h2 className="font bold text-slate-100">
                          {item.producto.nombreProducto}
                        </h2>
                      </td>

                      {/* DESCRIPCIÓN */}

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-400 max-w-xs">
                          {item.producto.descripcion}
                        </p>
                      </td>

                      {/* CANTIDAD */}

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              restarCantidad(item.producto._id)
                            }
                            className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold hover:bg-slate-700 transition"
                          >
                            −
                          </button>

                          <span className="w-8 text-center font-bold text-white">
                            {item.cantidad}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              sumarCantidad(item.producto._id)
                            }
                            className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold hover:bg-slate-700 transition"
                          >
                            +
                          </button>

                        </div>
                      </td>

                      {/* PRECIO */}

                      <td className="px-6 py-5 text-center">
                        <span className="font-black text-green-400">
                          ${item.producto.precio.toLocaleString("es-AR")}
                        </span>
                      </td>

                      {/* ELIMINAR */}

                      <td className="px-6 py-5 text-center">

                        <button
                          type="button"
                          onClick={() =>
                            eliminarProducto(item.producto._id)
                          }
                          className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500/20 hover:text-red-300 transition"
                        >
                          Eliminar
                        </button>

                      </td>

                    </tr>
                  ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* RESUMEN */}

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Productos
            </span>

            <span className="font-bold">
              {cantidadTotal}
            </span>
          </div>

          <div className="border-t border-slate-800 my-5" />

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              Total
            </span>

            <span className="text-3xl font-black text-green-400">
              ${precioTotal.toLocaleString("es-AR")}
            </span>
          </div>

          {/* BOTÓN VACIAR */}

          <button
            type="button"
            onClick={vaciarCarrito}
            className="mt-6 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/20 transition"
          >
            Vaciar carrito
          </button>

          {/* BOTÓN PAGAR */}

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