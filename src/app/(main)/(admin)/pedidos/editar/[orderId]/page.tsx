import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { EditOrderForm } from "./_components/EditOrderForm";

export default async function AdminEditOrderPage({
  params: { orderId },
}: {
  params: { orderId: string };
}) {
  const id = Number(orderId);

  if (isNaN(id)) return notFound();

  const order = await api.order.getById(id);

  if (!order) return notFound();

  return <EditOrderForm order={order} />;
}
