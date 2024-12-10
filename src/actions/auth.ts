"use server";

import { verify } from "@/lib/argon";
import { unformatId } from "@/lib/utils";
import { lucia } from "@/server/auth/init";
import { getSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { loginSchema, type loginSchemaType } from "@/validators/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionResponse } from "./general";
import { LOGIN_REDIRECT_ROLE } from "@/data/const";

export async function login(data: loginSchemaType) {
  let existingUser;

  try {
    const { success } = loginSchema.safeParse(data);

    if (!success) return ActionResponse.error("Invalid arguments");

    const userId = unformatId(data.code);

    if (!userId) return ActionResponse.error("Incorrect username or password");

    existingUser = await db.user.findUnique({ where: { id: userId } });

    if (!existingUser)
      return ActionResponse.error("Incorrect username or password");

    const passwordIsValid = await verify(existingUser.password, data.password);

    if (!passwordIsValid)
      return ActionResponse.error("Incorrect username or password");

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch {
    return ActionResponse.error("Something went wrong");
  }

  return ActionResponse.redirect(LOGIN_REDIRECT_ROLE[existingUser.role]);
}

export async function logout() {
  const session = await getSession();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
