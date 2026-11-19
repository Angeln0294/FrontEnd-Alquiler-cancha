import { apiFetch } from "./api";

export type RolUsuario = "usuario" | "admin";

export interface UsuarioDTO {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  emailVerificado: boolean;
}

export interface RespuestaUsuariosPaginados {
  usuarios: UsuarioDTO[];
  totalPaginas?: number;
  cantidadUsuarios?: number;
}

export interface ActualizarUsuarioPayload {
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: RolUsuario;
  activo?: boolean;
}

export const obtenerUsuariosAdminService = (
  pagina: number,
  limite: number,
  signal?: AbortSignal,
) => {
  return apiFetch<RespuestaUsuariosPaginados>(
    `/api/usuario?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      signal,
    },
  );
};

export const actualizarUsuarioService = (
  usuarioId: string,
  datos: ActualizarUsuarioPayload,
) => {
  return apiFetch<{ mensaje?: string }>(`/api/usuario/${usuarioId}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
};

export const eliminarUsuarioService = (usuarioId: string) => {
  return apiFetch<{ mensaje?: string }>(`/api/usuario/${usuarioId}`, {
    method: "DELETE",
  });
};