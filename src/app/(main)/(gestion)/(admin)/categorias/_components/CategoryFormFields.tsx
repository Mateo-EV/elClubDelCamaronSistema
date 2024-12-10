"use client";

import {
  FormInputController,
  FormTextAreaController,
} from "@/components/FormControllers";
import { type categorySchemaType } from "@/validators/category";
import { type Control } from "react-hook-form";

type CategoryFormFieldsProps = {
  control: Control<categorySchemaType>;
};

export const CategoryFormFields = ({ control }: CategoryFormFieldsProps) => {
  return (
    <>
      <div className="col-span-full">
        <FormInputController control={control} name="name" label="Nombre" />
      </div>
      <div className="col-span-full">
        <FormTextAreaController
          control={control}
          name="description"
          label="Descripción"
        />
      </div>
    </>
  );
};
