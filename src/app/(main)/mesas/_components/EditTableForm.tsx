import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { tableSchema } from "@/validators/table";
import { toast } from "sonner";
import { TableFormFields } from "./TableFormFields";

type EditTableFormProps = {
  table: RouterOutputs["table"]["getAll"][number];
};

export const EditTableForm = ({ table }: EditTableFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: editTable, isPending } = api.table.edit.useMutation({
    onSuccess: async (table) => {
      await apiUtils.table.getAll.cancel();

      apiUtils.table.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === table.id) return table;
          return p;
        });
      });

      void apiUtils.table.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Tablee actualizado");
    },
  });

  const form = useForm({
    schema: tableSchema,
    onFastSubmit: (values) => {
      editTable({ tableId: table.id, ...values });
    },
    defaultValues: {
      capacity: table.capacity,
      status: table.status,
    },
  });

  return (
    <Form {...form}>
      <TableFormFields control={form.control} />
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
