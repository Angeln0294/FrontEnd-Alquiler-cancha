import { apiFetch } from "./api";

export interface UsuarioAuthDTO {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: "usuario" | "admin";
  activo: boolean;
  emailVerificado: boolean;
}

export const obtenerUsuarioActualService = () => {
  return apiFetch<{ usuario: UsuarioAuthDTO }>("/api/usuario/me", {
    method: "GET",
  });
};

export const cerrarSesionService = () => {
  return apiFetch<void>("/api/usuario/logout", {
    method: "POST",
  });
};