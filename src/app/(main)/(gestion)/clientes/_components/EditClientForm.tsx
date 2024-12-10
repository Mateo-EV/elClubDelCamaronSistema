import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { customerSchema } from "@/validators/customer";
import { toast } from "sonner";
import { ClientFormFields } from "./ClientFormFields";

type EditClientFormProps = {
  client: RouterOutputs["customer"]["getAll"][number];
};

export const EditClientForm = ({ client }: EditClientFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: editClient, isPending } = api.customer.edit.useMutation({
    onSuccess: async (customer) => {
      await apiUtils.customer.getAll.cancel();

      apiUtils.customer.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === customer.id) return { ...customer, _count: p._count };
          return p;
        });
      });

      void apiUtils.customer.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Cliente actualizado");
    },
  });

  const form = useForm({
    schema: customerSchema,
    onFastSubmit: (values) => {
      editClient({ clientId: client.id, ...values });
    },
    defaultValues: {
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
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
          Editar
        </SubmitButton>
      </div>
    </Form>
  );
};
