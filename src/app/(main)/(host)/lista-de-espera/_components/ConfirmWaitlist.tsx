import { TableSelector } from "@/app/(main)/_components/orders/TableSelector";
import { WaiterSelector } from "@/app/(main)/_components/orders/WaiterSelector";
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
import { waitlistSeatSchema } from "@/validators/waitlist";
import { toast } from "sonner";

type ConfirmWaitlistFormProps = {
  waitlist: RouterOutputs["waitlist"]["getAll"][number];
};

export const ConfirmWaitlistForm = ({ waitlist }: ConfirmWaitlistFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: confirmWaitlist, isPending } = api.waitlist.seat.useMutation({
    onSuccess: async ({ waitlistUpdated, waiterUpdated }) => {
      await apiUtils.waitlist.getAll.cancel();

      apiUtils.waitlist.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === waitlist.id) return waitlistUpdated;
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

      void apiUtils.waitlist.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Cliente admitido");
    },
  });

  const form = useForm({
    schema: waitlistSeatSchema,
    onFastSubmit: confirmWaitlist,
    defaultValues: {
      waitlistId: waitlist.id,
    },
  });

  return (
    <Form {...form}>
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

      <FormField
        control={form.control}
        name="tableId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mesa</FormLabel>
            <FormControl>
              <TableSelector
                tableId={field.value}
                setTableId={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
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
