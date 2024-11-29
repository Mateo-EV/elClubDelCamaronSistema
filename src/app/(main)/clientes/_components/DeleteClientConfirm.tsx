"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type DeleteClientConfirmProps = {
  clientId: number;
};

export const DeleteClientConfirm = ({ clientId }: DeleteClientConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: deleteClient, isPending } = api.customer.delete.useMutation({
    onSuccess: async () => {
      await apiUtils.customer.getAll.cancel();

      apiUtils.customer.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.filter((p) => p.id !== clientId);
      });

      void apiUtils.customer.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Cliente eliminado");
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
        onClick={() => deleteClient(clientId)}
      >
        Eliminar
      </SubmitButton>
    </div>
  );
};
