"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type DeleteOrderConfirmProps = {
  orderId: number;
};

export const DeleteOrderConfirm = ({ orderId }: DeleteOrderConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: deleteOrder, isPending } = api.order.delete.useMutation({
    onSuccess: async () => {
      await apiUtils.order.getAll.cancel();

      apiUtils.order.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.filter((p) => p.id !== orderId);
      });

      void apiUtils.order.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Pedido eliminado");
    },
  });

  return (
    <div className="mt-4 flex justify-between">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <SubmitButton
        isSubmitting={isPending}
        variant="destructive"
        onClick={() => deleteOrder(orderId)}
      >
        Eliminar
      </SubmitButton>
    </div>
  );
};
