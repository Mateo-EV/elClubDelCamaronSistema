import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { lucia } from "./init";
import { UserRole } from "@prisma/client";
import { formatId } from "@/lib/utils";

export const getSession = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return null;
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}

  if (!result.user || !result.session) return null;

  result.user.code = formatId(result.user.id);

  return {
    user: result.user,
    ...result.session,
  };
});

export const isAdmin = cache(async () => {
  const session = (await getSession())!;

  return session.user.role === UserRole.ADMIN;
});

export const isHost = cache(async () => {
  const session = (await getSession())!;

  return session.user.role === UserRole.HOST;
});
