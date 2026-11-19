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

export interface RespuestaPreferenciaPago {
  init_point: string;
}

export interface HorarioTurnoDTO {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export interface RespuestaDisponibilidadDTO {
  turnos: HorarioTurnoDTO[];
}

export interface CrearReservaPayload {
  cancha: string;
  fecha: string;
  horaInicio: string;
}

export interface RespuestaCrearReserva {
  reserva: {
    _id: string;
  };
  mensaje?: string;
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

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

export const obtenerMisReservasService = (
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
    headers: jsonHeaders,
    body: JSON.stringify({ estado }),
  });
};

export const cancelarReservaService = (reservaId: string) => {
  return apiFetch<{ mensaje?: string }>(`/api/reservas/${reservaId}`, {
    method: "DELETE",
  });
};

export const crearPreferenciaPagoReservaService = (reservaId: string) => {
  return apiFetch<RespuestaPreferenciaPago>(
    "/api/pago/crear-preferencia-reserva",
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ reservaId }),
    },
  );
};

export const obtenerDisponibilidadReservaService = (
  canchaId: string,
  fecha: string,
  signal?: AbortSignal,
) => {
  return apiFetch<RespuestaDisponibilidadDTO>(
    `/api/reservas/disponibilidad/${canchaId}/${fecha}`,
    {
      method: "GET",
      signal,
    },
  );
};

export const crearReservaService = (payload: CrearReservaPayload) => {
  return apiFetch<RespuestaCrearReserva>("/api/reservas", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
};
export const obtenerReservasService = (signal?: AbortSignal) => {
  return apiFetch<RespuestaReservasPaginadas>("/api/reservas", {
    method: "GET",
    signal,
  });
};