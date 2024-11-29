import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
});

export type categorySchemaType = z.infer<typeof categorySchema>;

export const categoryEditServerSchema = categorySchema.extend({
  categoryId: z.number(),
});
