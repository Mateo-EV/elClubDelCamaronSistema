import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "./db";
import { Lucia } from "lucia";
import { type UserRole } from "@prisma/client";
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
      role: attributes.role,
      relatedId: attributes.relatedId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    userId: number;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  role: UserRole;
  relatedId: number;
}
