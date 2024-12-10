"use client";

import { ClientSelector } from "@/app/(main)/(gestion)/_components/orders/ClientSelector";
import {
  FormInputController,
  FormTextAreaController,
} from "@/components/FormControllers";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { type waitlistSchemaType } from "@/validators/waitlist";
import { type Control } from "react-hook-form";

type WaitlistFormFieldsProps = {
  control: Control<waitlistSchemaType>;
};

export const WaitlistFormFields = ({ control }: WaitlistFormFieldsProps) => {
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
      <FormInputController
        control={control}
        name="partySize"
        label="Cantidad de Personas"
        input={{ type: "number" }}
      />
      <div className="col-span-full">
        <FormTextAreaController control={control} name="notes" label="Notas" />
      </div>
    </>
  );
};
