"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type DeleteProductConfirmProps = {
  productId: number;
};

export const DeleteProductConfirm = ({
  productId,
}: DeleteProductConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: deleteProduct, isPending } = api.product.delete.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getAll.cancel();

      apiUtils.product.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.filter((p) => p.id !== productId);
      });

      void apiUtils.product.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Producto eliminado");
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
        onClick={() => deleteProduct(productId)}
      >
        Eliminar
      </SubmitButton>
    </div>
  );
};
