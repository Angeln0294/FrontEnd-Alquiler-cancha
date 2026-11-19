import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch, ApiError } from "../services/api";

interface EstadoLocation {
  email?: string;
}

interface RespuestaApi {
  mensaje?: string;
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
  const [verificado, setVerificado] = useState(false);

  const temporizadorRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navegacionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solicitudActivaRef = useRef(false);
  const codigoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    codigoRef.current?.focus();
    return () => {
      if (temporizadorRef.current !== null) {
        clearInterval(temporizadorRef.current);
      }
      if (navegacionRef.current !== null) {
        clearTimeout(navegacionRef.current);
      }
    };
  }, []);

  const iniciarTemporizador = (segundos: number) => {
    if (temporizadorRef.current !== null) {
      clearInterval(temporizadorRef.current);
    }

    setSegundosRestantes(segundos);

    temporizadorRef.current = setInterval(() => {
      setSegundosRestantes((actual) => {
        if (actual <= 1) {
          if (temporizadorRef.current !== null) {
            clearInterval(temporizadorRef.current);
            temporizadorRef.current = null;
          }
          return 0;
        }
        return actual - 1;
      });
    }, 1000);
  };

  const verificarCodigo = async () => {
    if (solicitudActivaRef.current || verificado) return;

    setMensaje("");
    setError("");

    if (!email) {
      setError("No se encontró el email. Volvé a registrarte.");
      codigoRef.current?.focus();
      return;
    }

    if (codigo.length !== 6) {
      setError("El código debe tener 6 dígitos.");
      codigoRef.current?.focus();
      return;
    }

    solicitudActivaRef.current = true;
    setCargando(true);

    try {
      const resultado = await apiFetch<RespuestaApi>(
        "/api/usuario/verificar-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, codigo }),
        },
      );

      setMensaje(resultado.mensaje || "Email verificado correctamente.");
      setVerificado(true);

      navegacionRef.current = setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error al verificar email:", error);
      if (error instanceof ApiError) {
        setError(error.message || "No se pudo verificar el código.");
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      solicitudActivaRef.current = false;
      setCargando(false);
    }
  };

  const reenviarCodigo = async () => {
    if (solicitudActivaRef.current || segundosRestantes > 0 || verificado) {
      return;
    }

    setMensaje("");
    setError("");

    if (!email) {
      setError("No se encontró el email.");
      return;
    }

    solicitudActivaRef.current = true;
    setReenviando(true);

    try {
      const resultado = await apiFetch<RespuestaApi>(
        "/api/usuario/reenviar-codigo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      setMensaje(resultado.mensaje || "Se envió un nuevo código.");
      iniciarTemporizador(60);
    } catch (error) {
      console.error("Error al reenviar código:", error);
      if (error instanceof ApiError) {
        setError(error.message || "No se pudo reenviar el código.");
        if (error.status === 429) {
          const coincidencia = error.message.match(/\d+/);
          if (coincidencia) {
            iniciarTemporizador(Number(coincidencia[0]));
          }
        }
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      solicitudActivaRef.current = false;
      setReenviando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-3 text-green-400">
          Verificar Email
        </h1>

        <p id="instrucciones-codigo" className="text-slate-400 text-center text-sm mb-6">
          Enviamos un código de 6 dígitos a:
        </p>

        <p className="text-center text-white font-semibold mb-6 break-all">
          {email || "Email no disponible"}
        </p>

        <form onSubmit={(e) => { e.preventDefault(); void verificarCodigo(); }} noValidate>
          <div className="mb-4">
            <label htmlFor="codigo-verificacion" className="block text-sm font-medium mb-2 text-slate-300">
              Código de verificación
            </label>

            <input
              ref={codigoRef}
              id="codigo-verificacion"
              name="codigo"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
              disabled={cargando || reenviando || verificado}
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? "instrucciones-codigo error-verificacion" : "instrucciones-codigo"}
              placeholder="123456"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl tracking-[0.5em]"
            />
          </div>

          {error && (
            <p id="error-verificacion" role="alert" className="text-red-400 text-sm text-center mb-4">
              {error}
            </p>
          )}

          {mensaje && (
            <p role="status" className="text-green-400 text-sm text-center mb-4">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando || reenviando || verificado}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-slate-950 font-bold p-3 rounded-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            {cargando ? "Verificando..." : verificado ? "Email verificado" : "Verificar Email"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-slate-500 text-sm mb-2">¿No recibiste el código?</p>

          <button
            type="button"
            onClick={reenviarCodigo}
            disabled={reenviando || cargando || segundosRestantes > 0 || verificado}
            className="text-green-400 hover:text-green-300 disabled:text-slate-600 disabled:cursor-not-allowed text-sm font-semibold rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400"
          >
            {reenviando ? "Enviando..." : segundosRestantes > 0 ? `Reenviar código (${segundosRestantes}s)` : "Reenviar código"}
          </button>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {segundosRestantes === 0 ? "Podés solicitar un nuevo código." : segundosRestantes % 15 === 0 ? `Podrás reenviar el código en ${segundosRestantes} segundos.` : ""}
          </p>
        </div>
      </div>
    </main>
  );
}
