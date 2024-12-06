"use client";

import {
  FormInputController,
  FormSelectController,
} from "@/components/FormControllers";
import { TABLE_STATUS } from "@/data/const";
import { type tableSchemaType } from "@/validators/table";
import { type Control } from "react-hook-form";

type TableFormFieldsProps = {
  control: Control<tableSchemaType>;
};

const STATUS_OPTIONS = Object.entries(TABLE_STATUS).map(([value, label]) => ({
  value,
  label,
}));

export const TableFormFields = ({ control }: TableFormFieldsProps) => {
  return (
    <>
      <FormInputController
        control={control}
        name="capacity"
        label="Capacidad"
        input={{ type: "number" }}
      />
      <FormSelectController
        control={control}
        name="status"
        label="Estado"
        options={STATUS_OPTIONS}
        placeholder="Seleccionar estado"
      />
    </>
  );
};
