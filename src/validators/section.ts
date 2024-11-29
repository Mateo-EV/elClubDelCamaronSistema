import { z } from "zod";

export const sectionSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
});

export type sectionSchemaType = z.infer<typeof sectionSchema>;

export const sectionEditServerSchema = sectionSchema.extend({
  sectionId: z.number(),
});
