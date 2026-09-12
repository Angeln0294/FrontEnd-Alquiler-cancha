import { useSearchParams, Link } from "react-router-dom";

export default function CheckoutResultado() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");

  if (status === "success") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-5">✅</div>

          <h1 className="text-3xl font-black">
            ¡Pago realizado!
          </h1>

          <p className="text-slate-400 mt-3">
            Tu pago fue aprobado correctamente.
          </p>

          <Link
            to="/tienda"
            className="inline-block mt-6 px-5 py-3 rounded-xl bg-green-500 text-slate-950 font-bold hover:bg-green-400 transition"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-5">⏳</div>

          <h1 className="text-3xl font-black">
            Pago pendiente
          </h1>

          <p className="text-slate-400 mt-3">
            Tu pago todavía está pendiente de confirmación.
          </p>

          <Link
            to="/tienda"
            className="inline-block mt-6 px-5 py-3 rounded-xl bg-green-500 text-slate-950 font-bold hover:bg-green-400 transition"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-5">❌</div>

        <h1 className="text-3xl font-black">
          El pago no se pudo realizar
        </h1>

        <p className="text-slate-400 mt-3">
          Hubo un problema con el pago.
        </p>

        <Link
          to="/carrito"
          className="inline-block mt-6 px-5 py-3 rounded-xl bg-green-500 text-slate-950 font-bold hover:bg-green-400 transition"
        >
          Volver al carrito
        </Link>
      </div>
    </div>
  );
}