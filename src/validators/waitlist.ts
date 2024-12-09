import { z } from "zod";

export const waitlistSchema = z.object({
  partySize: z.coerce
    .number({ message: "La cantidad de personas es obligatoria" })
    .int({ message: "La cantidad de personas debe ser entero" })
    .min(1, "La cantidad de personas debe ser mayor a 0"),
  clientId: z.coerce.number({ message: "El cliente es obligatorio" }),
  notes: z.string().nullish(),
});

export type waitlistSchemaType = z.infer<typeof waitlistSchema>;

export const waitlistEditServerSchema = waitlistSchema.extend({
  waitlistId: z.number(),
});

export const waitlistSeatSchema = z.object({
  waitlistId: z.number(),
  waiterId: z.coerce.number({ message: "El mozo es obligatorio" }),
  tableId: z.coerce.number({ message: "La mesa es obligatoria" }),
});
