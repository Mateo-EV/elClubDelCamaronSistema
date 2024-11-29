"use client";

import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { productSchema } from "@/validators/product";
import { toast } from "sonner";
import { ProductFormFields } from "./ProductFormFields";

export const CreateProductForm = () => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: createProduct, isPending } = api.product.create.useMutation({
    onSuccess: async (product) => {
      await apiUtils.product.getAll.cancel();

      apiUtils.product.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return [...prev, { ...product, orderDetails: [] }];
      });

      void apiUtils.product.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Producto creado");
    },
  });

  const form = useForm({
    schema: productSchema,
    onFastSubmit: createProduct,
    defaultValues: {
      name: "",
      description: "",
      stock: 0,
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
          Agregar
        </SubmitButton>
      </div>
    </Form>
  );
};
