"use client";

import { Form } from "@/components/FormControllers";
import { buttonVariants, SubmitButton } from "@/components/ui/button";
import useForm from "@/hooks/useForm";
import { api, type RouterOutputs } from "@/trpc/react";
import { orderWaiterProcessSchema } from "@/validators/order";
import Link from "next/link";
import { toast } from "sonner";
import { OrderFormFields } from "../../../_components/OrderFormFields";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type OrderEditProps = {
  order: NonNullable<RouterOutputs["waiter"]["getOrderDetail"]>;
};

export const OrderEdit = ({ order }: OrderEditProps) => {
  const apiUtils = api.useUtils();
  const router = useRouter();
  const { mutate: confirmWaiter, isPending } =
    api.waiter.editProcessingOrder.useMutation({
      onSuccess: async (order) => {
        await apiUtils.waiter.getMyOrdersFromToday.cancel();

        apiUtils.waiter.getMyOrdersFromToday.setData(undefined, (prev) => {
          if (!prev) return;

          return prev.map((p) => {
            if (p.id === order.id) return order;
            return p;
          });
        });

        void apiUtils.waiter.getMyOrdersFromToday.invalidate(undefined, {
          predicate: (q) => !q.state.data,
        });

        toast.success("Pedido editado con éxito");
        router.push("/asignaciones");
      },
    });

  const form = useForm({
    schema: orderWaiterProcessSchema,
    onFastSubmit: confirmWaiter,
    defaultValues: {
      orderId: order.id,
      details: order.details.map(({ productId, quantity }) => ({
        productId,
        quantity,
      })),
      notes: order.notes,
    },
  });

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <ShoppingCartIcon className="mr-2 inline" />
          <span className="align-middle">Detalles del Pedido</span>
        </CardTitle>
        <CardDescription>
          Agregue los productos que desee el cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <OrderFormFields control={form.control} />
          <div className="col-span-full mt-2 flex justify-between">
            <Link
              href="/asignaciones"
              className={buttonVariants({ variant: "secondary" })}
            >
              Volver
            </Link>
            <SubmitButton type="submit" isSubmitting={isPending}>
              Procesar
            </SubmitButton>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
