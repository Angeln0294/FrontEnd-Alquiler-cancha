import { useSearchParams, useNavigate } from "react-router-dom";

const CheckoutResultado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");

  const volverInicio = () => {
    navigate("/");
  };

  const irMisReservas = () => {
    navigate("/mis-reservas");
  };

  // ==============================
  // PAGO APROBADO
  // ==============================

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 px-6 py-12 flex items-center justify-center font-sans">
        <div className="w-full max-w-lg">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10 text-center">
            {/* ICONO */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <span className="text-5xl">✅</span>
            </div>

            {/* TÍTULO */}
            <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
              ¡Pago aprobado!
            </h1>

            {/* DESCRIPCIÓN */}
            <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-8">
              Tu pago fue procesado correctamente y tu reserva fue confirmada.
            </p>

            {/* SEPARADOR */}
            <div className="border-t border-slate-800 mb-6"></div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={irMisReservas}
                className="flex-1 bg-[#22c55e] text-[#0b132b] py-3 px-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e]/90 transition-all cursor-pointer"
              >
                📅 Mis reservas
              </button>

              <button
                type="button"
                onClick={volverInicio}
                className="flex-1 border border-slate-700 bg-slate-800/50 text-slate-300 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // PAGO PENDIENTE
  // ==============================

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 px-6 py-12 flex items-center justify-center font-sans">
        <div className="w-full max-w-lg">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10 text-center">
            {/* ICONO */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <span className="text-5xl">⏳</span>
            </div>

            {/* TÍTULO */}
            <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
              Pago pendiente
            </h1>

            {/* DESCRIPCIÓN */}
            <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-8">
              Mercado Pago todavía no confirmó tu pago. Te notificaremos cuando
              se complete.
            </p>

            {/* AVISO */}
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-6">
              <p className="text-xs text-yellow-400 font-medium">
                ⏳ Tu reserva permanecerá pendiente hasta que se confirme el
                pago.
              </p>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={irMisReservas}
                className="flex-1 bg-[#22c55e] text-[#0b132b] py-3 px-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e]/90 transition-all cursor-pointer"
              >
                📅 Mis reservas
              </button>

              <button
                type="button"
                onClick={volverInicio}
                className="flex-1 border border-slate-700 bg-slate-800/50 text-slate-300 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // PAGO RECHAZADO
  // ==============================

  if (status === "failure") {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 px-6 py-12 flex items-center justify-center font-sans">
        <div className="w-full max-w-lg">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10 text-center">
            {/* ICONO */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-5xl">❌</span>
            </div>

            {/* TÍTULO */}
            <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
              Pago rechazado
            </h1>

            {/* DESCRIPCIÓN */}
            <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-8">
              El pago no pudo ser procesado. Podés intentarlo nuevamente desde
              tus reservas.
            </p>

            {/* AVISO */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-xs text-red-400 font-medium">
                ⚠️ La reserva todavía no fue confirmada.
              </p>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={irMisReservas}
                className="flex-1 bg-[#22c55e] text-[#0b132b] py-3 px-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e]/90 transition-all cursor-pointer"
              >
                💳 Intentar nuevamente
              </button>

              <button
                type="button"
                onClick={volverInicio}
                className="flex-1 border border-slate-700 bg-slate-800/50 text-slate-300 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // RESULTADO DESCONOCIDO
  // ==============================

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 px-6 py-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-lg">
        <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10 text-center">
          {/* ICONO */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-500/10 border border-slate-700 flex items-center justify-center">
            <span className="text-5xl">❓</span>
          </div>

          {/* TÍTULO */}
          <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
            Resultado desconocido
          </h1>

          {/* DESCRIPCIÓN */}
          <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-8">
            No pudimos determinar el estado del pago.
          </p>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={irMisReservas}
              className="flex-1 bg-[#22c55e] text-[#0b132b] py-3 px-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#22c55e]/90 transition-all cursor-pointer"
            >
              📅 Mis reservas
            </button>

            <button
              type="button"
              onClick={volverInicio}
              className="flex-1 border border-slate-700 bg-slate-800/50 text-slate-300 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutResultado;
