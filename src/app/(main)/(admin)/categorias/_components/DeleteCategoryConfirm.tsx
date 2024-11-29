"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type DeleteCategoryConfirmProps = {
  categoryId: number;
};

export const DeleteCategoryConfirm = ({
  categoryId,
}: DeleteCategoryConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: deleteCategory, isPending } = api.category.delete.useMutation(
    {
      onSuccess: async () => {
        await apiUtils.category.getAll.cancel();

        apiUtils.category.getAll.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.filter((p) => p.id !== categoryId);
        });

        void apiUtils.category.getAll.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        setOpen(false);

        toast.success("Categoría eliminada");
      },
    },
  );

  return (
    <div className="mt-4 flex justify-between">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <SubmitButton
        isSubmitting={isPending}
        variant="destructive"
        onClick={() => deleteCategory(categoryId)}
      >
        Eliminar
      </SubmitButton>
    </div>
  );
};
