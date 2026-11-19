import { apiFetch } from "./api";

export interface CanchaDTO {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  disponible: boolean;
}

export interface RespuestaCanchasPaginadas {
  canchas: CanchaDTO[];
  cantidadCanchas: number;
  totalPaginas?: number;
}

export interface CrearActualizarCanchaPayload {
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: "Fútbol 5" | "Fútbol 7" | "Fútbol 11";
  disponible: boolean;
  imagen?: FileList;
}

function construirFormDataCancha(datos: CrearActualizarCanchaPayload): FormData {
  const formData = new FormData();
  formData.append("nombre", datos.nombre);
  formData.append("descripcion", datos.descripcion);
  formData.append("precio", datos.precio.toString());
  formData.append("tipo", datos.tipo);
  formData.append("disponible", datos.disponible.toString());

  if (datos.imagen && datos.imagen.length > 0) {
    formData.append("imagen", datos.imagen[0]);
  }

  return formData;
}

export const obtenerCanchasAdminService = (
  pagina: number,
  limite: number,
  signal?: AbortSignal,
) => {
  return apiFetch<RespuestaCanchasPaginadas>(
    `/api/canchas?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      signal,
    },
  );
};

export const crearCanchaService = (datos: CrearActualizarCanchaPayload) => {
  return apiFetch("/api/canchas", {
    method: "POST",
    body: construirFormDataCancha(datos),
  });
};

export const actualizarCanchaService = (
  id: string,
  datos: CrearActualizarCanchaPayload,
) => {
  return apiFetch(`/api/canchas/${id}`, {
    method: "PUT",
    body: construirFormDataCancha(datos),
  });
};

export const eliminarCanchaService = (id: string) => {
  return apiFetch(`/api/canchas/${id}`, {
    method: "DELETE",
  });
};