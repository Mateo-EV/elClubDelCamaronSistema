"use client";

import useForm from "@/hooks/useForm";
import { Form, FormInputController } from "@/components/FormControllers";
import { loginSchema } from "@/validators/auth";
import { SubmitButton } from "@/components/ui/button";
import { login } from "@/actions/auth";
import { toast } from "sonner";

export const LoginForm = () => {
  const form = useForm({
    schema: loginSchema,
    onSubmit: async (data) => {
      const res = await login(data);
      if (res?.error) {
        toast.error(res.error);
      }
    },
    defaultValues: {
      code: "",
      password: "",
    },
  });

  return (
    <Form {...form} className="sm:grid-cols-1">
      <FormInputController
        control={form.control}
        label="Código"
        name="code"
        input={{ placeholder: "U000000" }}
      />
      <FormInputController
        control={form.control}
        label="Contraseña"
        name="password"
        input={{ placeholder: "***********", type: "password" }}
      />
      <SubmitButton
        isSubmitting={form.formState.isSubmitting}
        className="mt-2 w-full"
      >
        Ingresar
      </SubmitButton>
    </Form>
  );
};
