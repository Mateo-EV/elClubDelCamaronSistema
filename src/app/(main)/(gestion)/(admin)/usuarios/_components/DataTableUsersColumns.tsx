"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROLES_DATA } from "@/data/const";
import { formatId } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { IdCardIcon, PhoneIcon } from "lucide-react";
import { EditUserForm } from "./EditUserForm";
import { DeleteUserConfirm } from "./DeleteUserConfirm";

export const usersTableColums = [
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
    accessorKey: "role",
    cell: ({ row: { original: user } }) => {
      const rolData = ROLES_DATA[user.role];

      return (
        <div className="flex w-[100px] items-center">
          <rolData.icon className="mr-2 size-4 text-muted-foreground" />
          <span>{rolData.name}</span>
        </div>
      );
    },
    filterFn: (row, id, values: string[]) => {
      return values.includes(row.getValue(id));
    },
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
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ModalResponsive
          title="Editar Usuario"
          description="Actualiza los datos del usuario"
          trigger={<Button variant="secondary">Editar</Button>}
        >
          <EditUserForm user={row.original} />
        </ModalResponsive>
        <ModalResponsive
          title="Eliminar Usuario"
          description="¿Estás seguro que deseas eliminar al usuario? Esta acción es irreversible"
          trigger={<Button variant="destructive">Eliminar</Button>}
        >
          <DeleteUserConfirm userId={row.original.id} />
        </ModalResponsive>
      </div>
    ),
  },
] as const satisfies ColumnDef<RouterOutputs["user"]["getAll"][number]>[];
