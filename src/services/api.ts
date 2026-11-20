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

  const esFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (esFormData) {
    // El navegador debe establecer automáticamente el Content-Type
    // con el boundary correspondiente.
    headers.delete("Content-Type");
  } else if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
  `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
  {
    ...options,
    headers,
    credentials: options.credentials ?? "include",
  },
);

 const texto = await response.text();

  if (!response.ok) {
    let mensaje = `Error HTTP ${response.status}`;

    try {
      const resultado = texto ? JSON.parse(texto) : {};
     const erroresValidacion = Array.isArray(resultado.errors)
  ? resultado.errors
      .map((error: { msg?: string }) => error.msg)
      .filter(Boolean)
      .join("\n")
  : "";

mensaje =
  resultado.mensaje ||
  resultado.message ||
  resultado.error ||
  erroresValidacion ||
  mensaje;
    } catch {
      
    }

    throw new ApiError(response.status, mensaje);
  }

if (!texto) {
  return undefined as T;
}

return JSON.parse(texto) as T;
}
