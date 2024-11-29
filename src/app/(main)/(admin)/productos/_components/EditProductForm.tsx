import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { productSchema } from "@/validators/product";
import { toast } from "sonner";
import { ProductFormFields } from "./ProductFormFields";

type EditProductFormProps = {
  product: RouterOutputs["product"]["getAll"][number];
};

export const EditProductForm = ({ product }: EditProductFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: editProduct, isPending } = api.product.edit.useMutation({
    onSuccess: async (product) => {
      await apiUtils.product.getAll.cancel();

      apiUtils.product.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === product.id)
            return { ...product, orderDetails: p.orderDetails };
          return p;
        });
      });

      void apiUtils.product.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Producto actualizado");
    },
  });

  const form = useForm({
    schema: productSchema,
    onFastSubmit: (values) => {
      editProduct({ productId: product.id, ...values });
    },
    defaultValues: {
      name: product.name,
      description: product.description ?? undefined,
      sectionId: product.sectionId,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
    },
  });

  return (
    <Form {...form}>
      <ProductFormFields control={form.control} />
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
