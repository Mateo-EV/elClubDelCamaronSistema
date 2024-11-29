import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const orderAdminCreateSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    message: "El estado del pedido es obligatorio",
  }),
  paymentMethodId: z.coerce.number({
    message: "El método de pago es obligatorio",
  }),
  clientId: z.coerce.number({ message: "El cliente es obligatorio" }),
  waiterId: z.coerce.number({ message: "El mozo es obligatorio" }),
  tableId: z.coerce.number({ message: "La mesa es obligatoria" }),
  notes: z
    .string()
    .max(255, "Las notas tienen un límite de 255 caracteres")
    .nullish(),
  details: z
    .array(
      z.object({
        productId: z.coerce.number({ message: "El producto es obligatorio" }),
        quantity: z.coerce
          .number({ message: "La cantidad es obligatoria" })
          .int({ message: "La cantidad debe ser un entero" })
          .min(1, { message: "La cantidad debe ser mayor que 0" }),
      }),
    )
    .min(1, "Debe haber al menos un producto para crear el pedido"),
});

export type orderAdminCreateSchemaType = z.infer<typeof orderAdminCreateSchema>;

export const orderAdminEditSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    message: "El estado del pedido es obligatorio",
  }),
  paymentMethodId: z.coerce.number({
    message: "El método de pago es obligatorio",
  }),
  clientId: z.coerce.number({ message: "El cliente es obligatorio" }),
  waiterId: z.coerce.number({ message: "El mozo es obligatorio" }),
  tableId: z.coerce.number({ message: "La mesa es obligatoria" }),
  notes: z
    .string()
    .max(255, "Las notas tienen un límite de 255 caracteres")
    .nullish(),
  details: z
    .array(
      z.object({
        productId: z.coerce.number({ message: "El producto es obligatorio" }),
        quantity: z.coerce
          .number({ message: "La cantidad es obligatoria" })
          .int({ message: "La cantidad debe ser un entero" })
          .min(1, { message: "La cantidad debe ser mayor que 0" }),
      }),
    )
    .min(1, "El pedido debe tener al menos un pedido"),
});
