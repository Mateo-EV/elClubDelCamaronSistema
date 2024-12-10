"use client";

import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { api, type RouterOutputs } from "@/trpc/react";
import { useMemo } from "react";
import { useWatch, type Control } from "react-hook-form";

type TotalOrderProps = {
  control: Control<{
    status: "Pending" | "InProcess" | "Canceled" | "Completed";
    paymentMethodId: number;
    clientId: number;
    waiterId: number;
    tableId: number;
    details: {
      productId: number;
      quantity: number;
    }[];
    notes?: string | null;
  }>;
};

export const TotalOrder = ({ control }: TotalOrderProps) => {
  const details = useWatch({ control, name: "details" });
  const { data: products } = api.product.getAll.useQuery();

  const productsIndexed = useMemo(() => {
    return products?.reduce<
      Record<string, RouterOutputs["product"]["getAll"][number]>
    >((acc, curr) => {
      acc[curr.id.toString()] = curr;

      return acc;
    }, {});
  }, [products]);

  if (!products) return <div />;

  const amount = details.reduce((acc, { productId, quantity }) => {
    if (productsIndexed?.[productId as unknown as string]?.price) {
      return (
        acc +
        productsIndexed[productId as unknown as string]!.price *
          Number(quantity)
      );
    }
    return acc;
  }, 0);

  return (
    <div>
      <Label className="text-base">Precio:</Label>{" "}
      <span>{formatPrice(amount)}</span>
    </div>
  );
};
