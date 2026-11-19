import { apiFetch } from "./api";

export type EstadoReserva = "pendiente" | "confirmada" | "cancelada";

export interface UsuarioReserva {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
}

export interface CanchaReserva {
  _id: string;
  nombre: string;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  precio: number;
}

export interface ReservaDTO {
  _id: string;
  usuario: UsuarioReserva;
  cancha: CanchaReserva;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
  estado: EstadoReserva;
  createdAt?: string;
}

export interface RespuestaReservasPaginadas {
  reservas: ReservaDTO[];
  totalPaginas?: number;
  cantidadReservas?: number;
}

export const obtenerReservasAdminService = (
  pagina: number,
  limite: number,
  signal?: AbortSignal,
) => {
  return apiFetch<RespuestaReservasPaginadas>(
    `/api/reservas?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      signal,
    },
  );
};

export const actualizarEstadoReservaService = (
  reservaId: string,
  estado: EstadoReserva,
) => {
  return apiFetch<{ mensaje?: string }>(`/api/reservas/${reservaId}`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });
};