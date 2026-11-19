import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiFetch, ApiError } from "../services/api";

interface ItemCompra {
  producto: string;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
}

interface Orden {
  _id: string;
  items: ItemCompra[];
  montoTotal: number;
  estado: "pendiente" | "aprobada" | "rechazada" | "cancelada";
  createdAt: string;
}

export default function MisCompras() {
  const navigate = useNavigate();

  const [compras, setCompras] = useState<Orden[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [paginaActual, setPaginaActual] = useState(1);

  const comprasPorPagina = 6;

  const indiceUltimaCompra = paginaActual * comprasPorPagina;
  const indicePrimeraCompra = indiceUltimaCompra - comprasPorPagina;

  const comprasPagina = compras.slice(indicePrimeraCompra, indiceUltimaCompra);

  const cantidadPaginas = Math.ceil(compras.length / comprasPorPagina);

  const cargarCompras = async (signal?: AbortSignal) => {
    try {
      setCargando(true);

      const resultado = await apiFetch<{ ordenes: Orden[] }>(
        "/api/pago/mis-compras",
        {
          method: "GET",
          signal,
        },
      );

      if (signal?.aborted) return;
      setCompras(resultado.ordenes || []);
    } catch (error) {
      if (signal?.aborted) {
        return;
      }

      console.error("Error al obtener compras:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudieron cargar las compras",
        text:
          error instanceof ApiError
            ? error.message
            : "No se pudo conectar con el servidor.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#22c55e",
        background: "#1e293b",
        color: "#f8fafc",
      });
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    cargarCompras(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });
  };

  const obtenerClaseEstado = (estado: Orden["estado"]) => {
    switch (estado) {
      case "aprobada":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "pendiente":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "rechazada":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      case "cancelada":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const obtenerTextoEstado = (estado: Orden["estado"]) => {
    switch (estado) {
      case "aprobada":
        return "Aprobada";

      case "pendiente":
        return "Pendiente";

      case "rechazada":
        return "Rechazada";

      case "cancelada":
        return "Cancelada";

      default:
        return estado;
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-10 text-center">
            <p role="status" aria-live="polite" className="text-slate-400 text-sm">Cargando tus compras...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ENCABEZADO */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              🛍️ Mis compras
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Consultá el historial de tus compras.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/tienda")}
            className="w-fit text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400"
          >
            ← Ir a la tienda
          </button>
        </div>

        {compras.length === 0 ? (
          <div role="status" className="bg-[#1e293b] border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
            <div className="text-5xl mb-5">🛍️</div>

            <h2 className="text-lg font-bold text-white">
              Todavía no tenés compras
            </h2>

            <p className="text-sm text-slate-400 mt-2 mb-6">
              Cuando realices una compra, aparecerá aquí.
            </p>

            <button
              type="button"
              onClick={() => navigate("/tienda")}
              className="bg-[#22c55e] text-[#0b132b] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e]/90 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400"
            >
              Ver tienda
            </button>
          </div>
        ) : (
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto" role="region" aria-label="Historial de compras" tabIndex={0}>
              <table className="w-full min-w-225 text-sm">
                <caption className="sr-only">Historial de compras: fecha, productos, cantidad, total y estado de cada compra</caption>
                {/* CABECERA */}

                <thead className="bg-[#16213d] border-b border-slate-700">
                  <tr>
                    <th scope="col" className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Fecha
                    </th>

                    <th scope="col" className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Productos
                    </th>

                    <th scope="col" className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Cantidad
                    </th>

                    <th scope="col" className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Total
                    </th>

                    <th scope="col" className="px-5 py-4 text-center text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {comprasPagina.map((compra) => (
                    <tr
                      key={compra._id}
                      className="border-b-2 border-slate-700 transition-colors hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-6 align-top">
                        <span className="text-sm text-slate-200 font-medium">
                          {formatearFecha(compra.createdAt)}
                        </span>
                      </td>

                      <td className="px-5 py-6 align-top">
                        <div className="space-y-3">
                          {compra.items.map((item, index) => (
                            <div
                              key={`${compra._id}-${index}`}
                              className="pb-2"
                            >
                              <p className="font-bold text-white">
                                {item.nombreProducto}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                {formatearPrecio(item.precioUnitario)} c/u
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-6 align-top">
                        <div className="space-y-3">
                          {compra.items.map((item, index) => (
                            <p
                              key={`${compra._id}-cantidad-${index}`}
                              className="text-sm text-slate-300"
                            >
                              x{item.cantidad}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-6 align-top">
                        <span className="text-sm font-black text-green-400">
                          {formatearPrecio(compra.montoTotal)}
                        </span>
                      </td>

                      <td className="px-5 py-6 text-center align-top">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${obtenerClaseEstado(
                            compra.estado,
                          )}`}
                        >
                          {obtenerTextoEstado(compra.estado)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {cantidadPaginas > 1 && (
                <nav aria-label="Paginación de compras" className="flex justify-center items-center gap-2 mt-10 pb-6">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((pagina) => pagina - 1)}
                    aria-label="Página anterior de compras"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
                  >
                    ‹
                  </button>

                  {Array.from({ length: cantidadPaginas }, (_, index) => {
                    const pagina = index + 1;

                    return (
                      <button
                        key={pagina}
                        type="button"
                        onClick={() => setPaginaActual(pagina)}
                        aria-label={`Ir a la página ${pagina} de compras`}
                        aria-current={paginaActual === pagina ? "page" : undefined}
                        className={`w-10 h-10 rounded-lg font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 ${
                          paginaActual === pagina
                            ? "bg-green-500 text-slate-950"
                            : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {pagina}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={paginaActual === cantidadPaginas}
                    onClick={() => setPaginaActual((pagina) => pagina + 1)}
                    aria-label="Página siguiente de compras"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
                  >
                    ›
                  </button>
                </nav>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
