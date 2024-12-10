"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { DeleteSectionConfirm } from "./DeleteSectionConfirm";
import { EditSectionForm } from "./EditSectionForm";

export const sectionsTableColums = [
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
          title="Editar Sección"
          description="Actualiza los datos de la sección"
          trigger={<Button variant="secondary">Editar</Button>}
        >
          <EditSectionForm section={row.original} />
        </ModalResponsive>
        <ModalResponsive
          title="Eliminar Sección"
          description="¿Estás seguro que deseas eliminar la sección? Esta acción es irreversible"
          trigger={<Button variant="destructive">Eliminar</Button>}
        >
          <DeleteSectionConfirm sectionId={row.original.id} />
        </ModalResponsive>
      </div>
    ),
  },
] as const satisfies ColumnDef<RouterOutputs["section"]["getAll"][number]>[];
