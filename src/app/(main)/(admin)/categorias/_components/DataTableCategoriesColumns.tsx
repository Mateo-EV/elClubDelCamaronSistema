"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { DeleteCategoryConfirm } from "./DeleteCategoryConfirm";
import { EditCategoryForm } from "./EditCategoryForm";

export const categoriesTableColums = [
  {
    id: "Nombre",
    accessorKey: "name",
  },
  {
    id: "Productos",
    accessorKey: "_count.products",
  },
  {
    id: "Acciones",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ModalResponsive
          title="Editar Categoría"
          description="Actualiza los datos de la categoría"
          trigger={<Button variant="secondary">Editar</Button>}
        >
          <EditCategoryForm category={row.original} />
        </ModalResponsive>
        <ModalResponsive
          title="Eliminar Categoría"
          description="¿Estás seguro que deseas eliminar la categoría? Esta acción es irreversible"
          trigger={<Button variant="destructive">Eliminar</Button>}
        >
          <DeleteCategoryConfirm categoryId={row.original.id} />
        </ModalResponsive>
      </div>
    ),
  },
] as const satisfies ColumnDef<RouterOutputs["category"]["getAll"][number]>[];
