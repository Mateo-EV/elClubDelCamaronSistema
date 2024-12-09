"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ORDER_STATUS } from "@/data/const";
import { formatDate, formatId, formatPrice } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, EllipsisIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { DeleteOrderConfirm } from "./DeleteOrderConfirm";

export const ordersTableColums = [
  {
    id: "Código",
    accessorFn: ({ id }) => formatId(id, "#"),
  },
  {
    id: "Fecha",
    accessorKey: "createdAt",
    cell: ({ getValue }) => formatDate(getValue() as Date),
  },
  {
    id: "Mozo",
    accessorFn: ({ waiter }) => waiter.firstName + " " + waiter.lastName,
  },
  {
    id: "Cliente",
    accessorFn: ({ client }) => client.firstName + " " + client.lastName,
  },
  {
    id: "Total",
    accessorFn: ({ total }) => formatPrice(total),
  },
  {
    id: "Estado",
    accessorFn: ({ status }) => ORDER_STATUS[status],
    cell: ({
      row: {
        original: { status },
      },
    }) => <Badge variant={status}>{ORDER_STATUS[status]}</Badge>,
    filterFn: (row, id, values: string[]) => {
      return values.includes(row.getValue(id));
    },
  },
  {
    id: "Acciones",
    header: "",
    cell: Actions,
  },
] as const satisfies ColumnDef<RouterOutputs["order"]["getAll"][number]>[];

function Actions({
  row: { original },
}: {
  row: { original: RouterOutputs["order"]["getAll"][number] };
}) {
  const triggerDeleteModal = useRef<HTMLDivElement>(null!);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/pedidos/editar/${original.id}`}>
              <Edit2Icon />
              <span>Editar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => triggerDeleteModal.current.click()}
          >
            <Trash2Icon />
            <span>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalResponsive
        title="Eliminar Pedido"
        description="¿Estás seguro que deseas eliminar el pedido? Esta acción es irreversible"
        trigger={<div ref={triggerDeleteModal} className="hidden" />}
      >
        <DeleteOrderConfirm orderId={original.id} />
      </ModalResponsive>
    </>
  );
}
