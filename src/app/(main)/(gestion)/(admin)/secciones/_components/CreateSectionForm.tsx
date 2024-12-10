"use client";

import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { sectionSchema } from "@/validators/section";
import { toast } from "sonner";
import { SectionFormFields } from "./SectionFormFields";

export const CreateSectionForm = () => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: createSection, isPending } = api.section.create.useMutation({
    onSuccess: async (section) => {
      await apiUtils.section.getAll.cancel();

      apiUtils.section.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return [...prev, { ...section, _count: { products: 0 } }];
      });

      void apiUtils.section.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Sección creada");
    },
  });

  const form = useForm({
    schema: sectionSchema,
    onFastSubmit: createSection,
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <SectionFormFields control={form.control} />
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
