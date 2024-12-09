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
import { useIsAdmin } from "@/hooks/useAdmin";
import { CancelReservationConfirm } from "./CancelReservationConfirm";
import { ReservationStatus } from "@prisma/client";
import { ConfirmReservationForm } from "./ConfirmReservation";

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
    cell: Actions,
  },
] as const satisfies ColumnDef<
  RouterOutputs["reservation"]["getAll"][number]
>[];

function Actions({
  row,
}: {
  row: { original: RouterOutputs["reservation"]["getAll"][number] };
}) {
  const isAdmin = useIsAdmin();

  if (isAdmin)
    return (
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
    );

  if (row.original.status !== ReservationStatus.Pending) return null;

  return (
    <div className="flex gap-2">
      <ModalResponsive
        title="Confirmar Reservación"
        description="Confirma la reserva y asigna un mozo para que atienda a los clientes"
        trigger={<Button variant="success">Confirmar</Button>}
      >
        <ConfirmReservationForm reservation={row.original} />
      </ModalResponsive>
      <ModalResponsive
        title="Cancelar Reservación"
        description="Se ha cancelado la reservación"
        trigger={<Button variant="destructive">Cancelar</Button>}
      >
        <CancelReservationConfirm reservationId={row.original.id} />
      </ModalResponsive>
    </div>
  );
}
