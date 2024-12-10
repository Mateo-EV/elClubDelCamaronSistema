"use client";

import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { reservationSchema } from "@/validators/reservation";
import { toast } from "sonner";
import { ReservationFormFields } from "./ReservationFormFields";

export const CreateReservationForm = () => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: createReservation, isPending } =
    api.reservation.create.useMutation({
      onSuccess: async (reservation) => {
        await apiUtils.reservation.getAll.cancel();

        apiUtils.reservation.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return [...prev, reservation];
        });

        void apiUtils.reservation.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Reservación creada");
      },
    });

  const form = useForm({
    schema: reservationSchema,
    onFastSubmit: createReservation,
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <ReservationFormFields control={form.control} />
      <div className="col-span-full mt-2 flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
        <SubmitButton type="submit" isSubmitting={isPending}>
          Agregar
        </SubmitButton>
      </div>
    </Form>
  );
};
