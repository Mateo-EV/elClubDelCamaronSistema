"use client";

import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type DeleteSectionConfirmProps = {
  sectionId: number;
};

export const DeleteSectionConfirm = ({
  sectionId,
}: DeleteSectionConfirmProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: deleteSection, isPending } = api.section.delete.useMutation({
    onSuccess: async () => {
      await apiUtils.section.getAll.cancel();

      apiUtils.section.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.filter((p) => p.id !== sectionId);
      });

      void apiUtils.section.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Sección eliminada");
    },
  });

  return (
    <div className="mt-4 flex justify-between">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <SubmitButton
        isSubmitting={isPending}
        variant="destructive"
        onClick={() => deleteSection(sectionId)}
      >
        Eliminar
      </SubmitButton>
    </div>
  );
};
