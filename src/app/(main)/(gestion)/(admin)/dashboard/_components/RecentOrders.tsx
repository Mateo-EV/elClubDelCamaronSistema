import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatId, formatPrice } from "@/lib/utils";

export function RecentOrders({
  recentOrders,
}: {
  recentOrders: {
    client: {
      firstName: string;
      lastName: string;
    };
    total: number;
    id: number;
    tableId: number | null;
  }[];
}) {
  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div className="flex items-center" key={order.id}>
          <Avatar className="size-9">
            <AvatarFallback>
              {order.client.firstName[0]! + order.client.lastName[0]!}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {order.client.firstName + " " + order.client.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              Table {order.tableId} • Pedido {formatId(order.id, "#")}
            </p>
          </div>
          <div className="ml-auto font-medium">{formatPrice(order.total)}</div>
        </div>
      ))}
    </div>
  );
}
