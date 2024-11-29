import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  price: z.coerce
    .number({ message: "El precio es obligatorio" })
    .refine((n) => n > 0, { message: "El precio tiene que ser mayor a 0" }),
  stock: z.coerce
    .number()
    .int()
    .refine((n) => n >= 0, { message: "El stock no puede ser menor que 0" }),
  categoryId: z.coerce.number({ message: "La categoría es obligatoria" }),
  sectionId: z.coerce.number({ message: "La sección es obligatoria" }),
});

export type productSchemaType = z.infer<typeof productSchema>;

export const productEditServerSchema = productSchema.extend({
  productId: z.number(),
});
