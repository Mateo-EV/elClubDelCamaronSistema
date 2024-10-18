import { z } from "zod";

export const loginSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
