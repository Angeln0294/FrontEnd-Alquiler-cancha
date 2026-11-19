import { apiFetch } from "./api";

export interface ItemCompraDTO {
  producto: string;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
}

export type EstadoOrdenDTO =
  | "pendiente"
  | "aprobada"
  | "rechazada"
  | "cancelada";

export interface OrdenCompraDTO {
  _id: string;
  items: ItemCompraDTO[];
  montoTotal: number;
  estado: EstadoOrdenDTO;
  createdAt: string;
}

export interface RespuestaMisCompras {
  ordenes: OrdenCompraDTO[];
}

export interface RespuestaPreferenciaPago {
  init_point: string;
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

export const crearPreferenciaCarritoService = () => {
  return apiFetch<RespuestaPreferenciaPago>("/api/pago/crear-preferencia", {
    method: "POST",
  });
};

export const crearPreferenciaReservaService = (reservaId: string) => {
  return apiFetch<RespuestaPreferenciaPago>(
    "/api/pago/crear-preferencia-reserva",
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ reservaId }),
    },
  );
};

export const obtenerMisComprasService = (signal?: AbortSignal) => {
  return apiFetch<RespuestaMisCompras>("/api/pago/mis-compras", {
    method: "GET",
    signal,
  });
};