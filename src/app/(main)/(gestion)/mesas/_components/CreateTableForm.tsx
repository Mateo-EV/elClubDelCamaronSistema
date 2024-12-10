"use table";

import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { tableSchema } from "@/validators/table";
import { toast } from "sonner";
import { TableStatus } from "@prisma/client";
import { TableFormFields } from "./TableFormFields";

export const CreateTableForm = () => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: createTable, isPending } = api.table.create.useMutation({
    onSuccess: async (table) => {
      await apiUtils.table.getAll.cancel();

      apiUtils.table.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return [...prev, table];
      });

      void apiUtils.table.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Mesa creada");
    },
  });

  const form = useForm({
    schema: tableSchema,
    onFastSubmit: createTable,
    defaultValues: {
      capacity: 2,
      status: TableStatus.Available,
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
          Agregar
        </SubmitButton>
      </div>
    </Form>
  );
};
