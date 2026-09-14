import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

  // ==============================
  // CARGAR COMPRAS
  // ==============================

  const cargarCompras = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/pago/mis-compras`,
        {
          credentials: "include",
        },
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "No se pudieron obtener tus compras",
        );
      }

      setCompras(resultado.ordenes || []);
    } catch (error) {
      console.error("Error al obtener compras:", error);

      Swal.fire({
        icon: "error",
        title: "No se pudieron cargar las compras",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al obtener tus compras.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#22c55e",
        background: "#1e293b",
        color: "#f8fafc",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  // ==============================
  // FORMATEAR FECHA
  // ==============================

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==============================
  // FORMATEAR PRECIO
  // ==============================

  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });
  };

  // ==============================
  // ESTADO
  // ==============================

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

  // ==============================
  // CARGANDO
  // ==============================

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-slate-400 text-sm">Cargando tus compras...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // PÁGINA
  // ==============================

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
            className="w-fit text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            ← Ir a la tienda
          </button>
        </div>

        {/* SIN COMPRAS */}

        {compras.length === 0 ? (
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
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
              className="bg-[#22c55e] text-[#0b132b] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e]/90 transition-all cursor-pointer"
            >
              Ver tienda
            </button>
          </div>
        ) : (
          /* LISTADO */

          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-sm">
                {/* CABECERA */}

                <thead className="bg-[#16213d] border-b border-slate-700">
                  <tr>
                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Fecha
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Productos
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Cantidad
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-center text-[10px] uppercase tracking-widest font-black text-slate-500">
                      Estado
                    </th>
                  </tr>
                </thead>

                {/* CUERPO */}

                <tbody>
                  {comprasPagina.map((compra) => (
                    <tr
                      key={compra._id}
                      className="border-b-2 border-slate-700 transition-colors hover:bg-slate-800/40"
                      
                    >
                      {/* FECHA */}

                      <td className="px-5 py-6 align-top">
                        <span className="text-sm text-slate-200 font-medium">
                          {formatearFecha(compra.createdAt)}
                        </span>
                      </td>

                      {/* PRODUCTOS */}

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

                      {/* CANTIDAD */}

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

                      {/* TOTAL */}

                      <td className="px-5 py-6 align-top">
                        <span className="text-sm font-black text-green-400">
                          {formatearPrecio(compra.montoTotal)}
                        </span>
                      </td>

                      {/* ESTADO */}

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
                <div className="flex justify-center items-center gap-2 mt-10 pb-6">
                  {/* ANTERIOR */}

                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((pagina) => pagina - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>

                  {/* NÚMEROS DE PÁGINA */}

                  {Array.from({ length: cantidadPaginas }, (_, index) => {
                    const pagina = index + 1;

                    return (
                      <button
                        key={pagina}
                        type="button"
                        onClick={() => setPaginaActual(pagina)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
                          paginaActual === pagina
                            ? "bg-green-500 text-slate-950"
                            : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {pagina}
                      </button>
                    );
                  })}

                  {/* SIGUIENTE */}

                  <button
                    type="button"
                    disabled={paginaActual === cantidadPaginas}
                    onClick={() => setPaginaActual((pagina) => pagina + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
