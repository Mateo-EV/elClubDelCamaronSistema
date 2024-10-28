"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type DeleteUserConfirmProps = {
  userId: number;
};

export const DeleteUserConfirm = ({ userId }: DeleteUserConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: deleteUser, isPending } = api.user.delete.useMutation({
    onSuccess: async () => {
      await apiUtils.user.getAll.cancel();

      apiUtils.user.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.filter((p) => p.id !== userId);
      });

      void apiUtils.user.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Usuario eliminado");
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
        onClick={() => deleteUser(userId)}
      >
        Eliminar
      </SubmitButton>
    </div>
  );
};
