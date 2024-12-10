import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { Button, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { sectionSchema } from "@/validators/section";
import { toast } from "sonner";
import { SectionFormFields } from "./SectionFormFields";

type EditSectionFormProps = {
  section: RouterOutputs["section"]["getAll"][number];
};

export const EditSectionForm = ({ section }: EditSectionFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: editSection, isPending } = api.section.edit.useMutation({
    onSuccess: async (section) => {
      await apiUtils.section.getAll.cancel();

      apiUtils.section.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === section.id) return { ...section, _count: p._count };
          return p;
        });
      });

      void apiUtils.section.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Sección actualizada");
    },
  });

  const form = useForm({
    schema: sectionSchema,
    onFastSubmit: (values) => {
      editSection({ sectionId: section.id, ...values });
    },
    defaultValues: {
      name: section.name,
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
          Editar
        </SubmitButton>
      </div>
    </Form>
  );
};
