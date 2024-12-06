import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TABLE_STATUS } from "@/data/const";
import { type Table, TableStatus } from "@prisma/client";

interface TableCardProps {
  table: Table;
}

const stateStyles: Record<TableStatus, string> = {
  Available: "bg-green-100 text-green-800 hover:bg-green-100",
  Occupied: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  Reserved: "bg-blue-100 text-blue-800 hover:bg-blue-100",
};

export function TableCard({ table: { id, capacity, status } }: TableCardProps) {
  return (
    <Card className="transition hover:scale-105 hover:shadow-lg">
      <CardHeader className="items-center space-y-3">
        <span className="text-4xl">
          {status === TableStatus.Available && "✔️"}
          {status === TableStatus.Occupied && "🍽️"}
          {status === TableStatus.Reserved && "📅"}
        </span>
        <CardTitle className="flex items-center justify-between">
          Mesa {id}
        </CardTitle>
        <Badge className={stateStyles[status]}>{TABLE_STATUS[status]}</Badge>
        <CardDescription>Capacidad: {capacity}</CardDescription>
      </CardHeader>
    </Card>
  );
}
