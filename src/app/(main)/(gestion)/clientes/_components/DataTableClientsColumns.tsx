"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { EditClientForm } from "./EditClientForm";
import { DeleteClientConfirm } from "./DeleteClientConfirm";

export const clientsTableColums = [
  {
    id: "Nombre",
    accessorFn: ({ firstName, lastName }) => firstName + " " + lastName,
  },
  {
    id: "Email",
    accessorKey: "email",
  },
  {
    id: "Teléfono",
    accessorKey: "phone",
  },
  {
    id: "Pedidos",
    accessorKey: "_count.orders",
  },
  {
    id: "Reservas",
    accessorKey: "_count.reservations",
  },
  {
    id: "Acciones",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ModalResponsive
          title="Editar Cliente"
          description="Actualiza los datos del cliente"
          trigger={<Button variant="secondary">Editar</Button>}
        >
          <EditClientForm client={row.original} />
        </ModalResponsive>
        <ModalResponsive
          title="Eliminar Cliente"
          description="¿Estás seguro que deseas eliminar al cliente? Esta acción es irreversible"
          trigger={<Button variant="destructive">Eliminar</Button>}
        >
          <DeleteClientConfirm clientId={row.original.id} />
        </ModalResponsive>
      </div>
    ),
  },
] as const satisfies ColumnDef<RouterOutputs["customer"]["getAll"][number]>[];
