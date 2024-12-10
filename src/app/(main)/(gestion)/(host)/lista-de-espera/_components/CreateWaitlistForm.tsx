"use client";

import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { waitlistSchema } from "@/validators/waitlist";
import { toast } from "sonner";
import { WaitlistFormFields } from "./WaitlistFormFields";

export const CreateWaitlistForm = () => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: createWaitlist, isPending } = api.waitlist.create.useMutation(
    {
      onSuccess: async (waitlist) => {
        await apiUtils.waitlist.getAll.cancel();

        apiUtils.waitlist.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return [...prev, waitlist];
        });

        void apiUtils.waitlist.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Cliente agregado a la lista de espera");
      },
    },
  );

  const form = useForm({
    schema: waitlistSchema,
    onFastSubmit: createWaitlist,
    defaultValues: {
      partySize: 1,
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
          Agregar
        </SubmitButton>
      </div>
    </Form>
  );
};
