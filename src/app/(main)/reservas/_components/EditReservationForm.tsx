import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { reservationSchema } from "@/validators/reservation";
import { toast } from "sonner";
import { ReservationFormFields } from "./ReservationFormFields";

type EditReservationFormProps = {
  reservation: RouterOutputs["reservation"]["getAll"][number];
};

export const EditReservationForm = ({
  reservation,
}: EditReservationFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: editReservation, isPending } =
    api.reservation.edit.useMutation({
      onSuccess: async (reservation) => {
        await apiUtils.reservation.getAll.cancel();

        apiUtils.reservation.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.map((p) => {
            if (p.id === reservation.id) return reservation;
            return p;
          });
        });

        void apiUtils.reservation.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Reservación actualizada");
      },
    });

  const form = useForm({
    schema: reservationSchema,
    onFastSubmit: (values) => {
      editReservation({ reservationId: reservation.id, ...values });
    },
    defaultValues: {
      clientId: reservation.clientId,
      scheduledAt: reservation.scheduledAt,
      status: reservation.status,
      tableId: reservation.tableId,
    },
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
          Editar
        </SubmitButton>
      </div>
    </Form>
  );
};
