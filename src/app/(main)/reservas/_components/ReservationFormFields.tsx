"use client";

import {
  FormDateTimeController,
  FormSelectController,
} from "@/components/FormControllers";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { type reservationSchemaType } from "@/validators/reservation";
import { type Control } from "react-hook-form";
import { ClientSelector } from "../../_components/orders/ClientSelector";
import { TableSelector } from "../../_components/orders/TableSelector";
import { RESERVATION_STATUS } from "@/data/const";

type ReservationFormFieldsProps = {
  control: Control<reservationSchemaType>;
};

export const ReservationFormFields = ({
  control,
}: ReservationFormFieldsProps) => {
  const actualDate = new Date();
  const futureDate = new Date(actualDate);

  futureDate.setMonth(futureDate.getMonth() + 4);

  return (
    <>
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
      <FormDateTimeController
        control={control}
        name="scheduledAt"
        label="Fecha Programada"
        picker={{
          minutesAvailable: false,
          minDate: actualDate,
          maxDate: futureDate,
        }}
      />
      <FormSelectController
        control={control}
        name="status"
        label="Estado"
        placeholder="Seleccionar estado"
        options={Object.entries(RESERVATION_STATUS).map(([value, label]) => ({
          label,
          value,
        }))}
      />
    </>
  );
};
