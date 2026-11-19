import { apiFetch } from "./api";

export const crearPreferenciaCarritoService = () => {
  return apiFetch("/api/pago/crear-preferencia", {
    method: "POST",
  });
};

export const crearPreferenciaReservaService = (reservaId: string) => {
  return apiFetch("/api/pago/crear-preferencia-reserva", {
    method: "POST",
    body: JSON.stringify({ reservaId }),
  });
};

export const obtenerMisComprasService = () => {
  return apiFetch("/api/pago/mis-compras");
};