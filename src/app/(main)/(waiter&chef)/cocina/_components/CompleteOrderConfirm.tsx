"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type CompleteOrderConfirmProps = {
  orderId: number;
};

export const CompleteOrderConfirm = ({
  orderId,
}: CompleteOrderConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: completeOrder, isPending } = api.chef.sentOrder.useMutation({
    onSuccess: async (order) => {
      await apiUtils.chef.getMyOrdersFromToday.cancel();

      apiUtils.chef.getMyOrdersFromToday.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === orderId) return order;
          return p;
        });
      });

      void apiUtils.chef.getMyOrdersFromToday.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Pedido enviado");
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
        onClick={() => completeOrder(orderId)}
      >
        Enviar
      </SubmitButton>
    </div>
  );
};
