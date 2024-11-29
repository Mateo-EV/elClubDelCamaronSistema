"use client";

import { Form } from "@/components/FormControllers";
import { UserFormFields } from "./UserFormFields";
import useForm from "@/hooks/useForm";
import { userCreateSchema } from "@/validators/user";
import { api } from "@/trpc/react";
import { Button, SubmitButton } from "@/components/ui/button";
import { useModalReponsive } from "@/components/modal/ModalResponsive";
import { toast } from "sonner";

export const CreateUserForm = () => {
  const { setOpen } = useModalReponsive();

  const apiUtils = api.useUtils();
  const { mutate: createUser, isPending } = api.user.create.useMutation({
    onSuccess: async (user) => {
      await apiUtils.user.getAll.cancel();

      apiUtils.user.getAll.setData(undefined, (prev) => {
        if (!prev) return;

        return [...prev, user];
      });

      void apiUtils.user.getAll.invalidate(undefined, {
        predicate: (q) => !q.state.data,
      });

      setOpen(false);

      toast.success("Usuario creado");
    },
  });

  const form = useForm({
    schema: userCreateSchema,
    onFastSubmit: createUser,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      password: "",
      confirmedPassword: "",
      dni: "",
      phone: "",
    },
  });

  return (
    <Form {...form}>
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
          Agregar
        </SubmitButton>
      </div>
    </Form>
  );
};
