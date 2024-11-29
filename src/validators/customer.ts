import { z } from "zod";
import { phoneRegex } from "./regex-utils";

export const customerSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("El email es inválido"),
  phone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(phoneRegex, "El teléfono es inválido"),
});

export type clientSchemaType = z.infer<typeof customerSchema>;

export const customerEditServerSchema = customerSchema.extend({
  clientId: z.number(),
});
