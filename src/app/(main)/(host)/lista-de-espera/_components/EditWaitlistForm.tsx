import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { waitlistSchema } from "@/validators/waitlist";
import { toast } from "sonner";
import { WaitlistFormFields } from "./WaitlistFormFields";

type EditWaitlistFormProps = {
  waitlist: RouterOutputs["waitlist"]["getAll"][number];
};

export const EditWaitlistForm = ({ waitlist }: EditWaitlistFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: editWaitlist, isPending } = api.waitlist.edit.useMutation({
    onSuccess: async (waitlist) => {
      await apiUtils.waitlist.getAll.cancel();

      apiUtils.waitlist.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === waitlist.id) return waitlist;
          return p;
        });
      });

      void apiUtils.waitlist.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Asignación actualizada");
    },
  });

  const form = useForm({
    schema: waitlistSchema,
    onFastSubmit: (values) => {
      editWaitlist({ waitlistId: waitlist.id, ...values });
    },
    defaultValues: {
      clientId: waitlist.clientId,
      notes: waitlist.notes,
      partySize: waitlist.partySize,
    },
  });

  return (
    <Form {...form}>
      <WaitlistFormFields control={form.control} />
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
