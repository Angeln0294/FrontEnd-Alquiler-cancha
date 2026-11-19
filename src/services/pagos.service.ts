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
export const crearPreferenciaCarritoService = () => {
  return apiFetch<{ init_point: string }>("/api/pago/crear-preferencia", {
    method: "POST",
  });
};
export const obtenerMisComprasService = (signal?: AbortSignal) => {
  return apiFetch<RespuestaMisCompras>("/api/pago/mis-compras", {
    method: "GET",
    signal,
  });
};
