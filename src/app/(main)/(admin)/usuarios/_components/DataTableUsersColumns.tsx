"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROLES_DATA } from "@/data/const";
import { formatId } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { IdCardIcon, PhoneIcon } from "lucide-react";

export const usersTableColums: ColumnDef<
  RouterOutputs["user"]["getAll"][number]
>[] = [
  {
    id: "Código",
    accessorFn: ({ id }) => formatId(id),
  },
  {
    id: "Nombre",
    accessorFn: ({ firstName, lastName, email }) =>
      firstName + " " + lastName + " " + email,
    cell: ({ row: { original: user } }) => (
      <div className="inline-flex gap-2">
        <Avatar className="size-8 rounded-lg">
          {/* <AvatarImage src={user.firstname} alt={user.firstname} /> */}
          <AvatarFallback className="rounded-lg">
            {user.firstName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="truncate text-xs">{user.email}</span>
        </div>
      </div>
    ),
  },
  {
    id: "Rol",
    accessorFn: ({ role }) => ROLES_DATA[role].name,
  },
  {
    id: "Estado",
    accessorFn: () => "En linea",
  },
  {
    id: "Información Personal",
    accessorFn: ({ dni, phone, address }) => dni + " " + phone + " " + address,
    cell: ({ row: { original: user } }) => (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <IdCardIcon className="size-4" />
          {user.dni}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <PhoneIcon className="size-4" />
          {user.phone}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "Acciones",
    header: "",
    cell: () => (
      <div className="flex gap-2">
        <Button variant="secondary">Editar</Button>
        <Button variant="destructive">Eliminar</Button>
      </div>
    ),
  },
];
