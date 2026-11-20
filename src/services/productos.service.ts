import { apiFetch } from "./api";

export interface CategoriaDTO {
  _id: string;
  nombreCategoria: string;
}

export interface ProductoDTO {
  _id: string;
  nombreProducto: string;
  precio: number;
  categoria: CategoriaDTO;
  imagen: string;
  descripcion: string;
}

export interface DatosProductoPayload {
  nombreProducto: string;
  precio: number;
  categoria: string;
  imagen: File | null;
  descripcion: string;
}

export interface RespuestaProductosPaginados {
  productos: ProductoDTO[];
  cantidadProductos: number;
  totalPaginas?: number;
}

function construirFormDataProducto(datos: DatosProductoPayload): FormData {
  const formulario = new FormData();
  formulario.append("nombreProducto", datos.nombreProducto);
  formulario.append("precio", String(datos.precio));
  formulario.append("categoria", datos.categoria);
  formulario.append("descripcion", datos.descripcion);

  if (datos.imagen) {
    formulario.append("imagen", datos.imagen);
  }

  return formulario;
}

export const obtenerProductosService = (
  pagina: number,
  limite: number,
  termino = "",
) => {
  let endpoint = `/api/producto?pagina=${pagina}&limite=${limite}`;
  if (termino.trim() !== "") {
    endpoint += `&termino=${encodeURIComponent(termino)}`;
  }

  return apiFetch<RespuestaProductosPaginados>(endpoint, {
    method: "GET",
  });
};

export const obtenerTodasCategoriasService = () => {
  return apiFetch<{ categorias: CategoriaDTO[] }>("/api/categorias/todas", {
    method: "GET",
  });
};

export const crearProductoService = (datos: DatosProductoPayload) => {
  return apiFetch<void>("/api/producto", {
    method: "POST",
    body: construirFormDataProducto(datos),
  });
};

export const actualizarProductoService = (
  id: string,
  datos: DatosProductoPayload,
) => {
  return apiFetch<void>(`/api/producto/${id}`, {
    method: "PUT",
    body: construirFormDataProducto(datos),
  });
};

export const eliminarProductoService = (id: string) => {
  return apiFetch<void>(`/api/producto/${id}`, {
    method: "DELETE",
  });
};