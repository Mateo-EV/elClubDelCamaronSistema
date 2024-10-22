import {
  FormInputController,
  FormSelectController,
} from "@/components/FormControllers";
import { ROLES_DATA } from "@/data/const";
import { type userCreateSchemaType } from "@/validators/user";
import { type Control } from "react-hook-form";

type UserFormFieldProps = {
  control: Control<userCreateSchemaType>;
};

export const UserFormFields = ({ control }: UserFormFieldProps) => {
  return (
    <>
      <FormInputController control={control} name="firstName" label="Nombre" />
      <FormInputController control={control} name="lastName" label="Apellido" />
      <FormInputController control={control} name="email" label="Email" />
      <FormSelectController
        control={control}
        name="role"
        label="Rol"
        placeholder="Selecciona un rol"
        options={(Item) => (
          <>
            {Object.entries(ROLES_DATA).map(([value, { name }]) => (
              <Item key={value} value={value}>
                {name}
              </Item>
            ))}
          </>
        )}
      />
    </>
  );
};
