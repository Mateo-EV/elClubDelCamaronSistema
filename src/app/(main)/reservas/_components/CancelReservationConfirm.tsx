"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type CancelReservationConfirmProps = {
  reservationId: number;
};

export const CancelReservationConfirm = ({
  reservationId,
}: CancelReservationConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: cancelReservation, isPending } =
    api.reservation.cancel.useMutation({
      onSuccess: async (reservation) => {
        await apiUtils.reservation.getAll.cancel();

        apiUtils.reservation.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.map((p) => {
            if (p.id === reservationId) return reservation;
            return p;
          });
        });

        void apiUtils.reservation.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Reservación cancelada");
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
        onClick={() => cancelReservation(reservationId)}
      >
        Confirmar
      </SubmitButton>
    </div>
  );
};
