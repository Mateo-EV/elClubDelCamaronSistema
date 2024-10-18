import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "../db";
import { Lucia } from "lucia";
import { type User, type UserRole } from "@prisma/client";
import { env } from "@/env";

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
      firstname: attributes.firstName,
      lastname: attributes.lastName,
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
