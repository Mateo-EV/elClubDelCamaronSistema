import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { OrderEdit } from "./_components/OrderEdit";

export default async function WaiterEditOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const orderId = Number(params.orderId);

  if (isNaN(orderId)) return notFound();

  const order = await api.waiter.getOrderDetail(orderId);

  if (!order || order.status !== OrderStatus.InProcess) return notFound();

  return <OrderEdit order={order} />;
}
