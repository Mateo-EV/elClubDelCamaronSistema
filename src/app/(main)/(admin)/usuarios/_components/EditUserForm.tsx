import { Form } from "@/components/FormControllers";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { userEditSchema } from "@/validators/user";
import { toast } from "sonner";
import { UserFormFields } from "./UserFormFields";
import { Button, SubmitButton } from "@/components/ui/button";

type EditUserFormProps = {
  user: RouterOutputs["user"]["getAll"][number];
};

export const EditUserForm = ({ user }: EditUserFormProps) => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: editUser, isPending } = api.user.edit.useMutation({
    onSuccess: async (user) => {
      await apiUtils.user.getAll.cancel();

      apiUtils.user.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return prev.map((p) => {
          if (p.id === user.id) return user;
          return p;
        });
      });

      void apiUtils.user.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Usuario actualizado");
    },
  });

  const form = useForm({
    schema: userEditSchema,
    onFastSubmit: (values) => {
      editUser({ userId: user.id, ...values });
    },
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address ?? undefined,
      password: "",
      confirmedPassword: "",
      dni: user.dni,
      phone: user.phone,
      role: user.role,
    },
  });

  return (
    <Form {...form} className="grid-cols-1 sm:grid-cols-2">
      <UserFormFields control={form.control} />
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
