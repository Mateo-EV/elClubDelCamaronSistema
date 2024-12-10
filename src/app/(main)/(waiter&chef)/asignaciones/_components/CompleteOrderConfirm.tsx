"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type CancelOrderConfirmProps = {
  orderId: number;
};

export const CompleteOrderConfirm = ({ orderId }: CancelOrderConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: cancelOrder, isPending } =
    api.waiter.completeOrder.useMutation({
      onSuccess: async (order) => {
        await apiUtils.waiter.getMyOrdersFromToday.cancel();

        apiUtils.waiter.getMyOrdersFromToday.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.map((p) => {
            if (p.id === orderId) return order;
            return p;
          });
        });

        void apiUtils.waiter.getMyOrdersFromToday.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Pedido completado");
      },
    });

  return (
    <div className="mt-4 flex justify-between">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <SubmitButton
        isSubmitting={isPending}
        variant="success"
        onClick={() => cancelOrder(orderId)}
      >
        Completar
      </SubmitButton>
    </div>
  );
};
