"use client";

import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS } from "@/const";
import { formatDate, formatId, formatPrice } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { EllipsisIcon } from "lucide-react";

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
    id: "Método de Pago",
    accessorFn: ({ paymentMethod }) => paymentMethod?.name,
  },
  {
    id: "Estado",
    accessorKey: "status",
    cell: ({
      row: {
        original: { status },
      },
    }) => <Badge variant={status}>{ORDER_STATUS[status]}</Badge>,
  },
  {
    id: "Acciones",
    header: "",
    cell: () => <EllipsisIcon className="size-4" />,
  },
] as const satisfies ColumnDef<RouterOutputs["order"]["getAll"][number]>[];
