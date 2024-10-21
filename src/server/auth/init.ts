import { env } from "@/env";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { type User } from "@prisma/client";
import { Lucia } from "lucia";
import { db } from "../db";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      code: "",
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      email: attributes.email,
      phone: attributes.phone,
      address: attributes.address,
      role: attributes.role,
      dni: attributes.dni,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: Omit<User, "createdAt" | "password">;
  }
}
