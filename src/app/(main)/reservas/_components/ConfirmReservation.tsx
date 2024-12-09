import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { confirmReservationSchema } from "@/validators/reservation";
import { toast } from "sonner";
import { WaiterSelector } from "../../_components/orders/WaiterSelector";

type ConfirmReservationFormProps = {
  reservation: RouterOutputs["reservation"]["getAll"][number];
};

export const ConfirmReservationForm = ({
  reservation,
}: ConfirmReservationFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: confirmReservation, isPending } =
    api.reservation.confirm.useMutation({
      onSuccess: async ({ reservationUpdated, waiterUpdated }) => {
        await apiUtils.reservation.getAll.cancel();

        apiUtils.reservation.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.map((p) => {
            if (p.id === reservation.id) return reservationUpdated;
            return p;
          });
        });

        apiUtils.user.getWaiters.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.map((p) => {
            if (p.id === waiterUpdated.id) return waiterUpdated;
            return p;
          });
        });

        void apiUtils.reservation.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Reservación confirmada");
      },
    });

  const form = useForm({
    schema: confirmReservationSchema,
    onFastSubmit: confirmReservation,
    defaultValues: {
      reservationId: reservation.id,
    },
  });

  return (
    <Form {...form}>
      <div className="col-span-full">
        <FormField
          control={form.control}
          name="waiterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mozo</FormLabel>
              <FormControl>
                <WaiterSelector
                  waiterId={field.value}
                  setWaiterId={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-full mt-2 flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
        <SubmitButton type="submit" isSubmitting={isPending}>
          Confirmar
        </SubmitButton>
      </div>
    </Form>
  );
};
