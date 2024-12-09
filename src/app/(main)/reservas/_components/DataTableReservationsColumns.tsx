"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { DeleteReservationConfirm } from "./DeleteReservationConfirm";
import { EditReservationForm } from "./EditReservationForm";
import { formatDate } from "@/lib/utils";
import { RESERVATION_STATUS } from "@/data/const";
import { Badge } from "@/components/ui/badge";

export const reservationsTableColums = [
  {
    id: "Cliente",
    accessorFn: ({ client }) => client.firstName + " " + client.lastName,
  },
  {
    id: "Fecha de Programación",
    accessorKey: "scheduledAt",
    cell: ({ getValue }) => formatDate(getValue() as Date),
  },
  {
    id: "Estado",
    accessorFn: ({ status }) => RESERVATION_STATUS[status],
    cell: ({
      row: {
        original: { status },
      },
    }) => <Badge variant={status}>{RESERVATION_STATUS[status]}</Badge>,
  },
  {
    id: "Fecha de Creación",
    accessorKey: "createdAt",
    cell: ({ getValue }) => formatDate(getValue() as Date),
  },
  {
    id: "Acciones",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ModalResponsive
          title="Editar Reservación"
          description="Actualiza los datos de la reservación"
          trigger={<Button variant="secondary">Editar</Button>}
        >
          <EditReservationForm reservation={row.original} />
        </ModalResponsive>
        <ModalResponsive
          title="Eliminar Reservación"
          description="¿Estás seguro que deseas eliminar la reservación? Esta acción es irreversible"
          trigger={<Button variant="destructive">Eliminar</Button>}
        >
          <DeleteReservationConfirm reservationId={row.original.id} />
        </ModalResponsive>
      </div>
    ),
  },
] as const satisfies ColumnDef<
  RouterOutputs["reservation"]["getAll"][number]
>[];
