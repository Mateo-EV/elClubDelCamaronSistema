import { OrderDetailForm } from "@/app/(main)/(gestion)/_components/orders/OrderDetailForm";
import { FormTextAreaController } from "@/components/FormControllers";
import { type orderWaiterProcessSchemaType } from "@/validators/order";
import { type Control } from "react-hook-form";

type OrderFormFieldsProps = {
  control: Control<orderWaiterProcessSchemaType>;
};

export const OrderFormFields = ({ control }: OrderFormFieldsProps) => {
  return (
    <>
      <OrderDetailForm control={control as any} />
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
    </>
  );
};
