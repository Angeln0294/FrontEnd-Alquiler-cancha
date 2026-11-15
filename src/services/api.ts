
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiOptions extends RequestInit {
  
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("No está configurada la URL del backend.");
  }

  const response = await fetch(
    `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
    {
      ...options,
      credentials: options.credentials ?? "include",
    },
  );

  if (!response.ok) {
    let mensaje = `Error HTTP ${response.status}`;

    try {
      const resultado = await response.json();
      mensaje = resultado.mensaje || resultado.message || mensaje;
    } catch {
      // Se mantiene el mensaje HTTP si no hay un JSON válido.
    }

    throw new ApiError(response.status, mensaje);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
