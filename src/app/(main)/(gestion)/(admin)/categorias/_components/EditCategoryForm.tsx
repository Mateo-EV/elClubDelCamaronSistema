import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { categorySchema } from "@/validators/category";
import { toast } from "sonner";
import { CategoryFormFields } from "./CategoryFormFields";

type EditCategoryFormProps = {
  category: RouterOutputs["category"]["getAll"][number];
};

export const EditCategoryForm = ({ category }: EditCategoryFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: editCategory, isPending } = api.category.edit.useMutation({
    onSuccess: async (category) => {
      await apiUtils.category.getAll.cancel();

      apiUtils.category.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === category.id) return { ...category, _count: p._count };
          return p;
        });
      });

      void apiUtils.category.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Categoría actualizada");
    },
  });

  const form = useForm({
    schema: categorySchema,
    onFastSubmit: (values) => {
      editCategory({ categoryId: category.id, ...values });
    },
    defaultValues: {
      name: category.name,
      description: category.description ?? undefined,
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
          Editar
        </SubmitButton>
      </div>
    </Form>
  );
};
