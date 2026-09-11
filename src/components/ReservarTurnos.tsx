import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface CanchaDetalle {
  id: number;
  nombre: string;
  tipo: string; 
  superficie: string;
  precioHora: string;
  imagen: string;
  descripcion: string;
}

interface HorarioTurno {
  id: string;
  rango: string;
  estado: 'disponible' | 'ocupado' | 'seleccionado';
}

export default function ReservasPage() {
  const [searchParams] = useSearchParams();

  // Estados interactivos idénticos a los valores del mockup
  const [calendarDay, setCalendarDay] = useState<number>(25);
  const [turnoIdSeleccionado, setTurnoIdSeleccionado] = useState<string | null>('t6');

// 🔍 Leemos DIRECTAMENTE de la URL el nombre y el precio de forma reactiva
  const nombreCanchaUrl = searchParams.get('cancha') || "Cancha 5 - Fútbol 7";
  const precioCanchaUrl = searchParams.get('precio') || "$1200";

  // 💸 CÁLCULO DINÁMICO DEL 20% DE DESCUENTO (PROMO NOCTURNA)
// =========================================================
// Convertimos el texto del precio (ej: "$12.000") a un número limpio (12000)
const precioNumero = Number(precioCanchaUrl.replace(/[^0-8.-]+/g, "")) * 1000 || 12000;

// Verificamos si el turno seleccionado califica para la promo nocturna ('t6' es 21-22hs, 't7' es 23-24hs)
const esHorarioPromo = turnoIdSeleccionado === 't6' || turnoIdSeleccionado === 't7';

// Si aplica el horario promo, restamos el 20%, si no, queda el valor base
const precioFinalNumero = esHorarioPromo ? precioNumero * 0.8 : precioNumero;

// Le devolvemos el formato de moneda local tucumana (ej: $9.600)
const precioFinalFormateado = `$${precioFinalNumero.toLocaleString('es-AR')}`;

  
  const [turnos, setTurnos] = useState<HorarioTurno[]>([
    { id: 't1', rango: '18:00 - 19:00', estado: 'disponible' },
    { id: 't2', rango: '19:00 - 20:00', estado: 'disponible' },
    { id: 't3', rango: '10:00 - 21:00', estado: 'ocupado' },
    { id: 't4', rango: '20:00 - 21:00', estado: 'ocupado' },
    { id: 't5', rango: '21:00 - 22:00', estado: 'disponible' },
    { id: 't6', rango: '21:00 - 22:00', estado: 'seleccionado' }, // El bloque verde con tilde
    { id: 't7', rango: '23:00 - 24:00', estado: 'disponible' },
  ]);

  const handleSeleccionarTurno = (id: string) => {
    setTurnos(prev =>
      prev.map(t => {
        if (t.estado === 'ocupado') return t;
        if (t.id === id) {
          setTurnoIdSeleccionado(id);
          return { ...t, estado: 'seleccionado' };
        }
        return { ...t, estado: 'disponible' };
      })
    );
  };

  const turnoActual = turnos.find(t => t.id === turnoIdSeleccionado);

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 p-6 md:p-12 font-sans animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <h1 className="text-2xl font-bold tracking-tight text-white">Reserva de Cancha</h1>

        {/* 📊 ESTRUCTURA ASIMÉTRICA DE 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Tarjeta Informativa + Calendario (5 Columnas) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Detalles de la Cancha Pasada por URL */}
            <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <img 
                src="https://unsplash.com" 
                alt="Cancha" 
                className="w-full h-44 object-cover opacity-90"
              />
              <div className="p-5 space-y-2">
                <h4 className="text-lg font-bold text-white">{nombreCanchaUrl}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Estás visualizando la disponibilidad para {nombreCanchaUrl}. Césped con estándar profesional, excelente filtrado y luminaria LED de alta potencia.
                </p>
              </div>
            </div>

            {/* Calendario del Mes */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <button type="button" className="text-slate-400 hover:text-white transition-colors font-bold">&lt;</button>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">October 2026</span>
                <button type="button" className="text-slate-400 hover:text-white transition-colors font-bold">&gt;</button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-500 mb-2 uppercase">
                <span>Dom</span><span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Relleno días mes anterior*/}
                <span className="text-slate-800 py-2">25</span><span className="text-slate-800 py-2">26</span><span className="text-slate-800 py-2">27</span><span className="text-slate-800 py-2">28</span><span className="text-slate-800 py-2">29</span><span className="text-slate-800 py-2">30</span>
                <span className="text-slate-500 py-2 rounded-lg">1</span>
                
                {/* Días del mes corriente */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(dia => {
                  const isSelected = dia === calendarDay;
                  return (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => setCalendarDay(dia)}
                      className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#22c55e] text-[#0b132b] font-black shadow-md shadow-green-500/20' 
                          : 'text-slate-300 hover:bg-[#0b132b] border border-transparent hover:border-slate-800'
                      }`}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* COLUMNA DERECHA: Selector Horario + Resumen de Compra (7 Columnas) */}
          <div className="lg:col-span-7 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 h-full">
            
            {/* Grilla Selector de Horarios */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Seleccionar Horario
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {turnos.map(turno => {
                  if (turno.estado === 'ocupado') {
                    return (
                      <div 
                        key={turno.id} 
                        className="bg-[#0b132b]/40 border border-slate-800/80 text-slate-600 rounded-xl p-3 text-center cursor-not-allowed line-through flex flex-col justify-center h-14"
                      >
                        <span className="text-xs font-medium">{turno.rango}</span>
                        <span className="text-[9px] uppercase tracking-wider text-red-500/50 font-black mt-0.5">Ocupado</span>
                      </div>
                    );
                  }

                  if (turno.id === turnoIdSeleccionado) {
                    return (
                      <button
                        key={turno.id}
                        type="button"
                        className="bg-[#22c55e] text-[#0b132b] font-black rounded-xl p-3 text-center flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 h-14 w-full cursor-pointer border border-[#22c55e]"
                      >
                        <span className="text-xs tracking-wide">{turno.rango}</span>
                        <span className="text-xs">✓</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={turno.id}
                      type="button"
                      onClick={() => handleSeleccionarTurno(turno.id)}
                      className="bg-[#0b132b] border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl p-3 text-center text-xs font-bold transition-all h-14 hover:bg-[#0b132b]/80 cursor-pointer"
                    >
                      {turno.rango}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caja de Resumen Final de Reserva */}
            <div className="bg-[#0b132b] p-5 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-2">
                Resumen de Reserva
              </h4>
              
          <div className="space-y-3 text-xs text-slate-400">
                <div className="flex justify-between items-center">
                <span>Date:</span>
                <span className="text-slate-200 font-bold">Martes, {calendarDay} de Octubre</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Hora:</span>
                <span className="text-slate-200 font-bold">{turnoActual ? turnoActual.rango : 'No seleccionado'}</span>
          </div>
          <div className="flex justify-between items-center">
                <span>Court:</span>
                <span className="text-slate-200 font-bold">{nombreCanchaUrl}</span>
          </div>

  {/* 📢 NUEVO: Cartelito indicador que aparece solo si eligen horario nocturno */}
  {esHorarioPromo && (
    <div className="flex justify-between items-center text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-1.5 rounded-lg border border-green-500/20 uppercase tracking-wider">
      <span>¡Promo Nocturna Aplicada!</span>
      <span>-20% OFF</span>
    </div>
  )}

  {/* 💸 Fila del Total Modificada */}
  <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-800/80">
    <span className="text-slate-300 font-black">Total:</span>
    {/* 🟢 Cambiamos 'precioCanchaUrl' por 'precioFinalFormateado' para mostrar el descuento en vivo */}
    <span className="text-green-400 font-black text-lg">{precioFinalFormateado}</span>
  </div>
</div>


              {/* Botón definitivo para confirmar la operación */}
              <button
                type="button"
                disabled={!turnoIdSeleccionado}
                className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  turnoIdSeleccionado
                    ? 'bg-[#22c55e] text-[#0b132b] hover:bg-[#22c55e]/90 shadow-md shadow-green-500/10'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                Confirmar Reserva
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
