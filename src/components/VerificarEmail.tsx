import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface EstadoLocation {
  email?: string;
}

export default function VerificarEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const estado = location.state as EstadoLocation | null;
  const email = estado?.email || "";

  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  const verificarCodigo = async () => {
    setMensaje("");
    setError("");

    if (!email) {
      setError("No se encontró el email. Volvé a registrarte.");
      return;
    }

    if (codigo.length !== 6) {
      setError("El código debe tener 6 dígitos.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(
        "http://localhost:3003/api/usuario/verificar-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            codigo,
          }),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(resultado.mensaje || "Código incorrecto.");
        return;
      }

      setMensaje(resultado.mensaje);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error al verificar email:", error);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const reenviarCodigo = async () => {
    setMensaje("");
    setError("");

    if (!email) {
      setError("No se encontró el email.");
      return;
    }

    try {
      setReenviando(true);

      const respuesta = await fetch(
        "http://localhost:3003/api/usuario/reenviar-codigo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(resultado.mensaje || "No se pudo reenviar el código.");

        if (respuesta.status === 429) {
          const coincidencia = resultado.mensaje.match(/\d+/);

          if (coincidencia) {
            iniciarTemporizador(Number(coincidencia[0]));
          }
        }

        return;
      }

      setMensaje(resultado.mensaje);

      iniciarTemporizador(60);
    } catch (error) {
      console.error("Error al reenviar código:", error);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setReenviando(false);
    }
  };

  const iniciarTemporizador = (segundos: number) => {
    setSegundosRestantes(segundos);

    const intervalo = setInterval(() => {
      setSegundosRestantes((actual) => {
        if (actual <= 1) {
          clearInterval(intervalo);
          return 0;
        }

        return actual - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-3 text-green-400">
          Verificar Email
        </h2>

        <p className="text-slate-400 text-center text-sm mb-6">
          Enviamos un código de 6 dígitos a:
        </p>

        <p className="text-center text-white font-semibold mb-6 break-all">
          {email || "Email no disponible"}
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Código de verificación
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={codigo}
            onChange={(e) =>
              setCodigo(e.target.value.replace(/\D/g, ""))
            }
            placeholder="123456"
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl tracking-[0.5em]"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {mensaje && (
          <p className="text-green-400 text-sm text-center mb-4">
            {mensaje}
          </p>
        )}

        <button
          type="button"
          onClick={verificarCodigo}
          disabled={cargando}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-slate-950 font-bold p-3 rounded-lg transition"
        >
          {cargando ? "Verificando..." : "Verificar Email"}
        </button>

        <div className="mt-5 text-center">
          <p className="text-slate-500 text-sm mb-2">
            ¿No recibiste el código?
          </p>

          <button
            type="button"
            onClick={reenviarCodigo}
            disabled={reenviando || segundosRestantes > 0}
            className="text-green-400 hover:text-green-300 disabled:text-slate-600 disabled:cursor-not-allowed text-sm font-semibold"
          >
            {reenviando
              ? "Enviando..."
              : segundosRestantes > 0
              ? `Reenviar código (${segundosRestantes}s)`
              : "Reenviar código"}
          </button>
        </div>
      </div>
    </div>
  );
}