import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { OrderProcess } from "./_components/OrderProcess";
import { OrderStatus } from "@prisma/client";

export default async function WaiterProcessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const orderId = Number(params.orderId);

  if (isNaN(orderId)) return notFound();

  const order = await api.waiter.getOrderDetail(orderId);

  if (!order || order.status !== OrderStatus.Pending) return notFound();

  return <OrderProcess order={order} />;
}
