"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type DeleteWaitlistConfirmProps = {
  waitlistId: number;
};

export const DeleteWaitlistConfirm = ({
  waitlistId,
}: DeleteWaitlistConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: deleteWaitlist, isPending } = api.waitlist.delete.useMutation(
    {
      onSuccess: async () => {
        await apiUtils.waitlist.getAll.cancel();

        apiUtils.waitlist.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.filter((p) => p.id !== waitlistId);
        });

        void apiUtils.waitlist.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Cliente eliminado de la lista de espera");
      },
    },
  );

  return (
    <div className="mt-4 flex justify-between">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <SubmitButton
        isSubmitting={isPending}
        variant="destructive"
        onClick={() => deleteWaitlist(waitlistId)}
      >
        Eliminar
      </SubmitButton>
    </div>
  );
};
