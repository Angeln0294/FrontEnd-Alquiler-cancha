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
export interface RegistroUsuarioPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface RespuestaRegistro {
  mensaje?: string;
}
export interface LoginUsuarioPayload {
  email: string;
  password: string;
}

export interface RespuestaLogin {
  mensaje?: string;
}
export interface VerificarEmailPayload {
  email: string;
  codigo: string;
}

export interface RespuestaVerificacion {
  mensaje?: string;
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
export const registrarUsuarioService = (payload: RegistroUsuarioPayload) => {
  return apiFetch<RespuestaRegistro>("/api/usuario/registro", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
export const iniciarSesionService = (payload: LoginUsuarioPayload) => {
  return apiFetch<RespuestaLogin>("/api/usuario/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
export const verificarEmailService = (payload: VerificarEmailPayload) => {
  return apiFetch<RespuestaVerificacion>("/api/usuario/verificar-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const reenviarCodigoService = (email: string) => {
  return apiFetch<RespuestaVerificacion>("/api/usuario/reenviar-codigo", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};