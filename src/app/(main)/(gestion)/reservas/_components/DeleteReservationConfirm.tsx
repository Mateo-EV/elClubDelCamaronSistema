"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type DeleteReservationConfirmProps = {
  reservationId: number;
};

export const DeleteReservationConfirm = ({
  reservationId,
}: DeleteReservationConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: deleteReservation, isPending } =
    api.reservation.delete.useMutation({
      onSuccess: async () => {
        await apiUtils.reservation.getAll.cancel();

        apiUtils.reservation.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.filter((p) => p.id !== reservationId);
        });

        void apiUtils.reservation.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Reservación eliminada");
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
        onClick={() => deleteReservation(reservationId)}
      >
        Eliminar
      </SubmitButton>
    </div>
  );
};
