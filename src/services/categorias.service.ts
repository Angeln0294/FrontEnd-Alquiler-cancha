import { apiFetch } from "./api";

export interface CategoriaDTO {
  _id: string;
  nombreCategoria: string;
}

export interface RespuestaCategoriasPaginadas {
  categorias: CategoriaDTO[];
  paginacion?: {
    totalItems?: number;
    totalPages?: number;
  };
}

export const obtenerCategoriasPaginadasService = (
  page: number,
  limit: number,
) => {
  return apiFetch<RespuestaCategoriasPaginadas>(
    `/api/categorias?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );
};

export const obtenerTodasLasCategoriasService = () => {
  return apiFetch<{ categorias: CategoriaDTO[] }>("/api/categorias/todas", {
    method: "GET",
  });
};

export const crearCategoriaService = (nombreCategoria: string) => {
  return apiFetch<void>("/api/categorias", {
    method: "POST",
    body: JSON.stringify({ nombreCategoria }),
  });
};

export const actualizarCategoriaService = (
  id: string,
  nombreCategoria: string,
) => {
  return apiFetch<void>(`/api/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nombreCategoria }),
  });
};

export const eliminarCategoriaService = (id: string) => {
  return apiFetch<void>(`/api/categorias/${id}`, {
    method: "DELETE",
  });
};