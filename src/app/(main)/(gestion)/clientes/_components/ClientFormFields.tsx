import { FormInputController } from "@/components/FormControllers";
import { type clientSchemaType } from "@/validators/customer";
import { type Control } from "react-hook-form";

type ClientFormFieldsProps = {
  control: Control<clientSchemaType>;
};

export const ClientFormFields = ({ control }: ClientFormFieldsProps) => {
  return (
    <>
      <FormInputController control={control} name="firstName" label="Nombre" />
      <FormInputController control={control} name="lastName" label="Apellido" />
      <FormInputController control={control} name="email" label="Email" />
      <FormInputController control={control} name="phone" label="Teléfono" />
    </>
  );
};
