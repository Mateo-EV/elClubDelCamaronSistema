"use client";

import {
  FormComboboxController,
  FormInputController,
} from "@/components/FormControllers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { api } from "@/trpc/react";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { useFieldArray, useWatch, type Control } from "react-hook-form";

type OrderDetailFormProps = {
  control: Control<{
    details: {
      productId: number;
      quantity: number;
    }[];
  }>;
};

export const OrderDetailForm = ({ control }: OrderDetailFormProps) => {
  const { data: products, isLoading } = api.product.getAll.useQuery();

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control,
  });

  const productsIdChoosen = new Set<string>(
    useWatch({ control, name: "details" })?.map(
      ({ productId }) => productId as unknown as string,
    ),
  );

  if (isLoading || !products) {
    return <Skeleton className="h-36" />;
  }

  return (
    <div className="divide-y md:space-y-4 md:divide-y-0">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col items-start gap-2 rounded-md bg-card py-4 first:pt-0 last:pb-0 md:grid md:grid-cols-[1fr_5rem_36px] md:py-0 [&>div]:w-full"
        >
          <FormComboboxController
            control={control}
            name={`details.${index}.productId`}
            emptyMessage="Productos no encontrados"
            label="Producto"
            searchPlaceholder="Buscar productos..."
            placeholder="Seleccionar Producto"
            options={products.map((p) => ({
              value: p.id.toString(),
              label: `${p.name} - ${formatPrice(p.price)}`,
              disabled: productsIdChoosen.has(p.id.toString()),
            }))}
          />
          <FormInputController
            control={control}
            name={`details.${index}.quantity`}
            label="Cantidad"
            input={{ type: "number", className: "bg-background" }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
            className="self-end"
          >
            <MinusCircleIcon className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        onClick={() => append({ productId: undefined!, quantity: 1 })}
        className="w-full"
      >
        <PlusCircleIcon className="mr-2 size-4" />
        Agregar Producto
      </Button>
    </div>
  );
};
