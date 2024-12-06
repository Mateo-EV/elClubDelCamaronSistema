import { TableStatus } from "@prisma/client";
import { z } from "zod";

export const tableSchema = z.object({
  capacity: z.coerce
    .number({ message: "La capacidad es obligatoria" })
    .int("La capacidad debe ser un número entero")
    .min(2, "La capacidad debe ser de un mínimo de 2")
    .max(10, "La capacidad máxima de una mesa debe ser de 10"),
  status: z.nativeEnum(TableStatus),
});

export type tableSchemaType = z.infer<typeof tableSchema>;

export const tableEditServerSchema = tableSchema.extend({
  tableId: z.number(),
});
