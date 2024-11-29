"use client";

import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { categorySchema } from "@/validators/category";
import { toast } from "sonner";
import { CategoryFormFields } from "./CategoryFormFields";

export const CreateCategoryForm = () => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: createCategory, isPending } = api.category.create.useMutation(
    {
      onSuccess: async (category) => {
        await apiUtils.category.getAll.cancel();

        apiUtils.category.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return [...prev, { ...category, _count: { products: 0 } }];
        });

        void apiUtils.category.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Categoría creada");
      },
    },
  );

  const form = useForm({
    schema: categorySchema,
    onFastSubmit: createCategory,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <CategoryFormFields control={form.control} />
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
