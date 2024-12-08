"use client";

import { ClientSelector } from "@/app/(main)/_components/orders/ClientSelector";
import { OrderDetailForm } from "@/app/(main)/_components/orders/OrderDetailForm";
import { TableSelector } from "@/app/(main)/_components/orders/TableSelector";
import { TotalOrder } from "@/app/(main)/_components/orders/TotalOrder";
import { WaiterSelector } from "@/app/(main)/_components/orders/WaiterSelector";
import {
  Form,
  FormSelectController,
  FormTextAreaController,
} from "@/components/FormControllers";
import { SubmitButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ORDER_STATUS } from "@/data/const";
import useForm from "@/hooks/useForm";
import { api } from "@/trpc/react";
import { orderAdminCreateSchema } from "@/validators/order";
import { ShoppingCartIcon } from "lucide-react";

export default function AdminCreateOrderPage() {
  const { mutate: createOrder, isPending } = api.order.create.useMutation();
  const form = useForm({
    schema: orderAdminCreateSchema,
    onFastSubmit: createOrder,
    defaultValues: {
      details: [{ productId: undefined, quantity: 1 }],
    },
  });

  return (
    <Form {...form} className="grid-cols-1 sm:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>
            Rellene los campos para crear el pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ClientSelector
                      clientId={field.value}
                      setClientId={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="waiterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mozo</FormLabel>
                  <FormControl>
                    <WaiterSelector
                      waiterId={field.value}
                      setWaiterId={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tableId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mesa</FormLabel>
                  <FormControl>
                    <TableSelector
                      tableId={field.value}
                      setTableId={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormSelectController
              control={form.control}
              name="status"
              label="Estado"
              placeholder="Seleccionar estado"
              options={Object.entries(ORDER_STATUS).map(([value, label]) => ({
                label,
                value,
              }))}
            />
            <div className="col-span-full">
              <FormTextAreaController
                control={form.control}
                name="notes"
                label="Notas"
                textarea={{
                  placeholder: "Información extra sobre el pedido",
                  minHeight: 80,
                  maxHeight: 100,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <ShoppingCartIcon className="mr-2 inline" />
            <span className="align-middle">Detalles del Pedido</span>
          </CardTitle>
          <CardDescription>
            Agregue los productos relacionados a este pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderDetailForm control={form.control} />
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <div className="flex items-center justify-between p-6">
          <TotalOrder control={form.control} />
          <SubmitButton isSubmitting={isPending}>Crear Pedido</SubmitButton>
        </div>
      </Card>
    </Form>
  );
}
