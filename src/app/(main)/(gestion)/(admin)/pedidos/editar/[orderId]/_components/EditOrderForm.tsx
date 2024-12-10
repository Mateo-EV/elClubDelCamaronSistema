"use client";

import { TotalOrder } from "@/app/(main)/(gestion)/_components/orders/TotalOrder";
import { Form } from "@/components/FormControllers";
import { SubmitButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { orderAdminEditSchema } from "@/validators/order";
import { toast } from "sonner";
import { OrderFormFields } from "../../../_components/OrderFormFields";

type EditOrderFormProps = {
  order: NonNullable<RouterOutputs["order"]["getById"]>;
};

export const EditOrderForm = ({ order }: EditOrderFormProps) => {
  const apiUtils = api.useUtils();
  const { mutate: editOrder, isPending } = api.order.edit.useMutation({
    onSuccess: async (order) => {
      await apiUtils.order.getAll.cancel();

      apiUtils.order.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === order.id) return order;
          return p;
        });
      });

      void apiUtils.order.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      toast.success("Pedido actualizado");
    },
  });

  const form = useForm({
    schema: orderAdminEditSchema,
    onFastSubmit: editOrder,
    defaultValues: {
      orderId: order.id,
      clientId: order.clientId,
      status: order.status,
      details: order.details.map(({ productId, quantity }) => ({
        productId,
        quantity,
      })),
      notes: order.notes ?? "",
      tableId: order.tableId,
      waiterId: order.waiterId,
    },
  });

  return (
    <Form {...form}>
      <OrderFormFields control={form.control as any} />
      <Card className="col-span-full">
        <div className="flex items-center justify-between p-6">
          <TotalOrder control={form.control as any} />
          <SubmitButton isSubmitting={isPending} type="submit">
            Editar Pedido
          </SubmitButton>
        </div>
      </Card>
    </Form>
  );
};
