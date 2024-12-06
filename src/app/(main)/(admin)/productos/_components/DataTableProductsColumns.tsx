"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { EditProductForm } from "./EditProductForm";
import { DeleteProductConfirm } from "./DeleteProductConfirm";
import { formatPrice } from "@/lib/utils";

export const productsTableColums = [
  {
    id: "Nombre",
    accessorKey: "name",
  },
  {
    id: "Stock",
    accessorKey: "stock",
  },
  {
    id: "Precio",
    accessorFn: ({ price }) => formatPrice(price),
  },
  {
    id: "Categoría",
    accessorKey: "category.name",
    filterFn: (row, id, values: string[]) => {
      return values.includes(row.getValue(id));
    },
  },
  {
    id: "Sección",
    accessorKey: "section.name",
    filterFn: (row, id, values: string[]) => {
      return values.includes(row.getValue(id));
    },
  },
  {
    id: "Pedidos",
    accessorFn: ({ orderDetails }) =>
      orderDetails.reduce((acc, curr) => acc + curr.quantity, 0),
  },
  {
    id: "Ganancias",
    accessorFn: ({ orderDetails }) =>
      formatPrice(
        orderDetails.reduce(
          (acc, curr) => acc + curr.quantity * curr.unitPrice,
          0,
        ),
      ),
  },
  {
    id: "Acciones",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ModalResponsive
          title="Editar Producto"
          description="Actualiza los datos del producto"
          trigger={<Button variant="secondary">Editar</Button>}
        >
          <EditProductForm product={row.original} />
        </ModalResponsive>
        <ModalResponsive
          title="Eliminar Producto"
          description="¿Estás seguro que deseas eliminar al producto? Esta acción es irreversible"
          trigger={<Button variant="destructive">Eliminar</Button>}
        >
          <DeleteProductConfirm productId={row.original.id} />
        </ModalResponsive>
      </div>
    ),
  },
] as const satisfies ColumnDef<RouterOutputs["product"]["getAll"][number]>[];
