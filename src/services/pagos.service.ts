import { apiFetch } from "./api";

export const crearPreferenciaCarritoService = () => {
  return apiFetch<{ init_point: string }>("/api/pago/crear-preferencia", {
    method: "POST",
  });
};