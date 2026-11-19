import { apiFetch } from "./api";

export interface ItemCarritoDTO {
  producto: {
    _id: string;
    nombreProducto: string;
    precio: number;
    imagen: string;
    descripcion: string;
    categoria: {
      _id: string;
      nombreCategoria: string;
    };
  };
  cantidad: number;
}

export interface CarritoDTO {
  _id: string;
  usuario: string;
  items: ItemCarritoDTO[];
}

export const obtenerCarritoService = () => {
  return apiFetch<CarritoDTO>("/api/carrito", {
    method: "GET",
  });
};

export const agregarItemCarritoService = (productoId: string, cantidad = 1) => {
  return apiFetch<{ carrito: CarritoDTO }>("/api/carrito", {
    method: "POST",
    body: JSON.stringify({
      producto: productoId,
      cantidad,
    }),
  });
};

export const restarItemCarritoService = (productoId: string) => {
  return apiFetch<{ carrito: CarritoDTO }>(
    `/api/carrito/restar/${productoId}`,
    {
      method: "PATCH",
    },
  );
};

export const eliminarItemCarritoService = (productoId: string) => {
  return apiFetch<void>(`/api/carrito/producto/${productoId}`, {
    method: "DELETE",
  });
};

export const vaciarCarritoService = () => {
  return apiFetch<void>("/api/carrito", {
    method: "DELETE",
  });
};