"use client";

import {
  FormInputController,
  FormSelectController,
  FormTextAreaController,
} from "@/components/FormControllers";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { type productSchemaType } from "@/validators/product";
import { type Control } from "react-hook-form";

type ProductFormFieldsProps = {
  control: Control<productSchemaType>;
};

export const ProductFormFields = ({ control }: ProductFormFieldsProps) => {
  const [categoryQuery, sectionQuery] = api.useQueries((t) => [
    t.category.getAll(),
    t.section.getAll(),
  ]);

  const isLoadingData = categoryQuery.isLoading && sectionQuery.isLoading;

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
      <FormInputController
        control={control}
        name="stock"
        label="Stock"
        input={{ type: "number" }}
      />
      <FormInputController
        control={control}
        name="price"
        label="Precio (S/.)"
        input={{ type: "number" }}
      />
      {isLoadingData ? (
        <>
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </>
      ) : (
        <>
          <FormSelectController
            control={control}
            name="categoryId"
            label="Categoría"
            options={
              categoryQuery.data?.map(({ id, name }) => ({
                value: id.toString(),
                label: name,
              })) ?? []
            }
            placeholder="Seleccionar categoría"
          />
          <FormSelectController
            control={control}
            name="sectionId"
            label="Sección"
            options={
              sectionQuery.data?.map(({ id, name }) => ({
                value: id.toString(),
                label: name,
              })) ?? []
            }
            placeholder="Seleccionar sección"
          />
        </>
      )}
    </>
  );
};
