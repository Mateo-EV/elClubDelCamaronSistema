"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type CancelWaitlistConfirmProps = {
  waitlistId: number;
};

export const CancelWaitlistConfirm = ({
  waitlistId,
}: CancelWaitlistConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: cancelWaitlist, isPending } = api.waitlist.cancel.useMutation(
    {
      onSuccess: async (waitlist) => {
        await apiUtils.waitlist.getAll.cancel();

        apiUtils.waitlist.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.map((p) => {
            if (p.id === waitlistId) return waitlist;
            return p;
          });
        });

        void apiUtils.waitlist.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Cliente cancelado de la lista de espera");
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
        onClick={() => cancelWaitlist(waitlistId)}
      >
        Confirmar
      </SubmitButton>
    </div>
  );
};
