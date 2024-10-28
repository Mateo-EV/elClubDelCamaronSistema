import { UserRole } from "@prisma/client";
import { z } from "zod";
import { phoneRegex } from "./regex-utils";

const userSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("El email es inválido"),
  role: z.nativeEnum(UserRole, { message: "El rol el obligatorio" }),
  dni: z
    .string()
    .min(1, "El dni es obligatorio")
    .refine(
      (dni) => /^[0-9]{8}$/.test(dni),
      "El dni debe ser de 8 dígitos numéricos.",
    ),
  phone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(phoneRegex, "El teléfono es inválido"),
  address: z.string().optional(),
});

export const userCreateSchema = userSchema
  .extend({
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(8, "La contraseña debe tener como mínimo 8 caracteres"),
    confirmedPassword: z
      .string()
      .min(1, "La confirmación de la contraseña es obligatoria"),
  })
  .refine(({ confirmedPassword, password }) => password === confirmedPassword, {
    message: "Las contraseñas deben ser iguales",
    path: ["confirmedPassword"],
  });

export type userCreateSchemaType = z.infer<typeof userCreateSchema>;

const userEditPasswordSchema = userSchema.extend({
  password: z.string().refine(
    (password) => {
      if (password.length === 0) return true;
      return password.length > 8;
    },
    { message: "La contraseña debe tener como mínimo 8 caracteres" },
  ),
  confirmedPassword: z.string().refine(
    (password) => {
      if (password.length === 0) return true;
      return password.length > 8;
    },
    {
      message:
        "La confirmación de lacontraseña debe tener como mínimo 8 caracteres",
    },
  ),
});

export const userEditSchema = userEditPasswordSchema.refine(
  ({ confirmedPassword, password }) => password === confirmedPassword,
  {
    message: "Las contraseñas deben ser iguales",
    path: ["confirmedPassword"],
  },
);

export const userEditSchemaServer = userEditPasswordSchema
  .extend({ userId: z.number() })
  .refine(({ confirmedPassword, password }) => password === confirmedPassword, {
    message: "Las contraseñas deben ser iguales",
    path: ["confirmedPassword"],
  });
