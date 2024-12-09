"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WAITLIST_STATUS } from "@/data/const";
import { formatDate } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  BetweenHorizontalStartIcon,
  CircleXIcon,
  Edit2Icon,
  EllipsisIcon,
  Trash2Icon,
} from "lucide-react";
import { CancelWaitlistConfirm } from "./CancelWaitlistConfirm";
import { EditWaitlistForm } from "./EditWaitlistForm";
import { DeleteWaitlistConfirm } from "./DeleteWaitlistConfirm";
import { useRef } from "react";
import { WaitlistStatus } from "@prisma/client";
import { ConfirmWaitlistForm } from "./ConfirmWaitlist";

export const waitlistTableColums = [
  {
    id: "Cliente",
    accessorFn: ({ client }) => client.firstName + " " + client.lastName,
  },
  {
    id: "Fecha",
    accessorKey: "reservationTime",
    cell: ({ getValue }) => formatDate(getValue() as Date),
  },
  {
    id: "Cantidad de Personas",
    accessorKey: "partySize",
  },
  {
    id: "Estado",
    accessorFn: ({ status }) => WAITLIST_STATUS[status],
    cell: ({
      row: {
        original: { status },
      },
    }) => <Badge variant={status}>{WAITLIST_STATUS[status]}</Badge>,
  },
  {
    id: "Acciones",
    header: "",
    cell: Actions,
  },
] as const satisfies ColumnDef<RouterOutputs["waitlist"]["getAll"][number]>[];

function Actions({
  row,
}: {
  row: { original: RouterOutputs["waitlist"]["getAll"][number] };
}) {
  const admitTrigger = useRef<HTMLDivElement>(null!);
  const editTrigger = useRef<HTMLDivElement>(null!);
  const cancelTrigger = useRef<HTMLDivElement>(null!);
  const deleteTrigger = useRef<HTMLDivElement>(null!);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {row.original.status === WaitlistStatus.Waiting && (
            <>
              <DropdownMenuItem onClick={() => admitTrigger.current.click()}>
                <BetweenHorizontalStartIcon />
                <span>Admitir</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editTrigger.current.click()}>
                <Edit2Icon />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => cancelTrigger.current.click()}>
                <CircleXIcon />
                <span>Cancelar</span>
              </DropdownMenuItem>
            </>
          )}
          {row.original.status !== WaitlistStatus.Seated && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => deleteTrigger.current.click()}
            >
              <Trash2Icon />
              <span>Eliminar</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {row.original.status === WaitlistStatus.Waiting && (
        <>
          <ModalResponsive
            title="Admitir cliente"
            description="Asigna un mozo y una mesa disponible"
            trigger={<div className="hidden" ref={admitTrigger} />}
          >
            <ConfirmWaitlistForm waitlist={row.original} />
          </ModalResponsive>
          <ModalResponsive
            title="Editar asignación"
            description="Actualiza los datos de esta asignación en espera"
            trigger={<div className="hidden" ref={editTrigger} />}
          >
            <EditWaitlistForm waitlist={row.original} />
          </ModalResponsive>
          <ModalResponsive
            title="Cancelar Asignación"
            description="Se ha cancelado la asignación"
            trigger={<div className="hidden" ref={cancelTrigger} />}
          >
            <CancelWaitlistConfirm waitlistId={row.original.id} />
          </ModalResponsive>
        </>
      )}
      {row.original.status !== WaitlistStatus.Seated && (
        <ModalResponsive
          title="Eliminar asignación"
          description="¿Estás seguro que deseas eliminar la reservación? Esta acción es irreversible"
          trigger={<div className="hidden" ref={deleteTrigger} />}
        >
          <DeleteWaitlistConfirm waitlistId={row.original.id} />
        </ModalResponsive>
      )}
    </>
  );
}
