"use client";

import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { customerSchema } from "@/validators/customer";
import { toast } from "sonner";
import { ClientFormFields } from "./ClientFormFields";

export const CreateClientForm = () => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: createClient, isPending } = api.customer.create.useMutation({
    onSuccess: async (customer) => {
      await apiUtils.customer.getAll.cancel();

      apiUtils.customer.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return [
          ...prev,
          { ...customer, _count: { orders: 0, reservations: 0 } },
        ];
      });

      void apiUtils.customer.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Cliente creado");
    },
  });

  const form = useForm({
    schema: customerSchema,
    onFastSubmit: createClient,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  return (
    <Form {...form}>
      <ClientFormFields control={form.control} />
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
