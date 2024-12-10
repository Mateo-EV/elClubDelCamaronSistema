import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ORDER_STATUS } from "@/data/const";
import { formatId } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import { OrderStatus } from "@prisma/client";
import {
  CircleXIcon,
  ClockIcon,
  Edit2Icon,
  UserIcon,
  UtensilsIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { CancelOrderConfirm } from "./CancelOrderConfirm";

type OrderCardProps = {
  order: RouterOutputs["waiter"]["getMyOrdersFromToday"][number];
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function isPlural(n: number) {
  return n === 1 ? "" : "s";
}

const getElapsedTime = (date: Date) => {
  const diffInSeconds = Math.floor(
    (new Date().getTime() - date.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} segundo${isPlural(diffInSeconds)}`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    return `${diffInMinutes} minuto${isPlural(diffInMinutes)}`;
  } else {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours} hora${isPlural(diffInHours)}`;
  }
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const cancelTrigger = useRef<HTMLDivElement>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          disabled={
            order.status === OrderStatus.Canceled ||
            order.status === OrderStatus.Completed
          }
        >
          <Card className="transition-shadow hover:ring-2 hover:ring-primary hover:ring-offset-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{order.client.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      Pedido {formatId(order.id, "#")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {order.client.firstName + " " + order.client.lastName}
                    </p>
                  </div>
                </div>
                <Badge className="self-baseline" variant={order.status}>
                  {ORDER_STATUS[order.status]}
                </Badge>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="size-4" />
                  <span>{formatTime(order.createdAt)}</span>
                  <span className="text-muted-foreground">
                    {getElapsedTime(order.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon className="size-4" />
                  <span>Mesa {order.tableId}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {order.status === OrderStatus.Pending ? (
            <DropdownMenuItem asChild>
              <Link href={`/asignaciones/process/${order.id}`}>
                <UtensilsIcon />
                <span>Procesar</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href={`/asignaciones/edit/${order.id}`}>
                <Edit2Icon />
                <span>Editar</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => cancelTrigger.current?.click()}
          >
            <CircleXIcon />
            <span>Cancelar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalResponsive
        title="Cancelar Pedido"
        description="¿Estás seguro que deseas cancelar la reservación? Esta acción es irreversible"
        trigger={<div ref={cancelTrigger} />}
      >
        <CancelOrderConfirm orderId={order.id} />
      </ModalResponsive>
    </>
  );
};
