import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TABLE_STATUS } from "@/data/const";
import { useAuth } from "@/providers/AuthProvider";
import { type Table, TableStatus } from "@prisma/client";
import { Edit2Icon, EllipsisIcon } from "lucide-react";
import { EditTableForm } from "./EditTableForm";
import { useRef } from "react";

interface TableCardProps {
  table: Table;
}

const TABLE_STATUS_CARD_STYLES = {
  [TableStatus.Available]: "bg-green-100 text-green-800 hover:bg-green-100",
  [TableStatus.Occupied]: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  [TableStatus.Reserved]: "bg-blue-100 text-blue-800 hover:bg-blue-100",
};

export function TableCard({ table }: TableCardProps) {
  const { user } = useAuth();

  return (
    <Card className="relative transition hover:scale-105 hover:shadow-lg">
      {user.role === "ADMIN" && <TableOptionsDropdown table={table} />}
      <CardHeader className="items-center space-y-3">
        <span className="text-4xl">
          {table.status === TableStatus.Available
            ? "✔️"
            : table.status === TableStatus.Occupied
              ? "🍽️"
              : "📅"}
        </span>
        <CardTitle className="flex items-center justify-between">
          Mesa {table.id}
        </CardTitle>
        <Badge className={TABLE_STATUS_CARD_STYLES[table.status]}>
          {TABLE_STATUS[table.status]}
        </Badge>
        <CardDescription>Capacidad: {table.capacity}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function TableOptionsDropdown({ table }: TableCardProps) {
  const editTableButton = useRef<HTMLDivElement>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="absolute left-0 top-0">
            <EllipsisIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={-5} alignOffset={5}>
          <DropdownMenuItem onClick={() => editTableButton.current!.click()}>
            <Edit2Icon />
            <span>Actualizar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalResponsive
        title="Editar Mesa"
        description="Actualiza los datos de la mesa"
        trigger={<div ref={editTableButton} />}
      >
        <EditTableForm table={table} />
      </ModalResponsive>
    </>
  );
}
