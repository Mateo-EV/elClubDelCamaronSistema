"use client";

import { TotalOrder } from "@/app/(main)/_components/orders/TotalOrder";
import { Form } from "@/components/FormControllers";
import { SubmitButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { orderAdminCreateSchema } from "@/validators/order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OrderFormFields } from "../_components/OrderFormFields";

export default function AdminCreateOrderPage() {
  const apiUtils = api.useUtils();
  const router = useRouter();
  const { mutate: createOrder, isPending } = api.order.create.useMutation({
    onSuccess: async (order) => {
      await apiUtils.order.getAll.cancel();

      apiUtils.order.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return [...prev, order];
      });

      void apiUtils.product.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      toast.success("Pedido creado");
      router.push(`/pedidos/editar/${order.id}`);
    },
  });

  const form = useForm({
    schema: orderAdminCreateSchema,
    onFastSubmit: createOrder,
    defaultValues: {
      details: [{ productId: undefined, quantity: 1 }],
    },
  });

  return (
    <Form {...form} className="grid-cols-1 sm:grid-cols-1 lg:grid-cols-2">
      <OrderFormFields control={form.control} />
      <Card className="col-span-full">
        <div className="flex items-center justify-between p-6">
          <TotalOrder control={form.control as any} />
          <SubmitButton isSubmitting={isPending} type="submit">
            Crear Pedido
          </SubmitButton>
        </div>
      </Card>
    </Form>
  );
}
