"use client";

import { ClientSelector } from "@/app/(main)/(gestion)/_components/orders/ClientSelector";
import { OrderDetailForm } from "@/app/(main)/(gestion)/_components/orders/OrderDetailForm";
import { TableSelector } from "@/app/(main)/(gestion)/_components/orders/TableSelector";
import { WaiterSelector } from "@/app/(main)/(gestion)/_components/orders/WaiterSelector";
import {
  FormSelectController,
  FormTextAreaController,
} from "@/components/FormControllers";
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
import { type orderAdminCreateSchemaType } from "@/validators/order";
import { ShoppingCartIcon } from "lucide-react";
import { type Control } from "react-hook-form";

type OrderFormFieldsProps = {
  control: Control<orderAdminCreateSchemaType>;
};

export const OrderFormFields = ({ control }: OrderFormFieldsProps) => {
  return (
    <>
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
                control={control}
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
          <OrderDetailForm control={control as any} />
        </CardContent>
      </Card>
    </>
  );
};
