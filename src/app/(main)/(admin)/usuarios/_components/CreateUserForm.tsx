"use client";

import { Form } from "@/components/FormControllers";
import { UserFormFields } from "./UserFormFields";
import useForm from "@/hooks/useForm";
import { userCreateSchema } from "@/validators/user";
import { api } from "@/trpc/react";
import { Button, SubmitButton } from "@/components/ui/button";
import { useModalReponsive } from "@/components/modal/ModalResponsive";

export const CreateUserForm = () => {
  const { setOpen } = useModalReponsive();

  const { mutate: createUser, isPending } = api.user.create.useMutation();

  const form = useForm({
    schema: userCreateSchema,
    onFastSubmit: createUser,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
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
          Agregar
        </SubmitButton>
      </div>
    </Form>
  );
};
