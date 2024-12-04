"use client";

import { ClientSelector } from "@/app/(main)/_components/utils/ClientSelector";
import { Form } from "@/components/FormControllers";
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
import useForm from "@/hooks/useForm";
import { orderAdminCreateSchema } from "@/validators/order";

export default function AdminCreateOrderPage() {
  const form = useForm({
    schema: orderAdminCreateSchema,
    onFastSubmit(values) {
      console.log(values);
    },
  });

  return (
    <Form {...form} className="grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>
            Rellene los campos para crear el pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2">
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
            {/* <FormComboboxController
              control={form.control}
              name="waiterId"
              emptyMessage="Mozos no encontrados"
              label="Mozo"
              placeholder="Seleccionar Mozo"
              searchPlaceholder="Buscar mozo..."
              options={}
            /> */}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Pedido</CardTitle>
          <CardDescription>
            Agregue los productos relacionados a este pedido
          </CardDescription>
        </CardHeader>
      </Card>
    </Form>
  );
}
