"use client";

import { FormInputController } from "@/components/FormControllers";
import { type sectionSchemaType } from "@/validators/section";
import { type Control } from "react-hook-form";

type SectionFormFieldsProps = {
  control: Control<sectionSchemaType>;
};

export const SectionFormFields = ({ control }: SectionFormFieldsProps) => {
  return (
    <div className="col-span-full">
      <FormInputController control={control} name="name" label="Nombre" />
    </div>
  );
};
