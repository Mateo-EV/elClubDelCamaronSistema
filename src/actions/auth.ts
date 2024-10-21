"use server";

import { verify } from "@/lib/argon";
import { unformatId } from "@/lib/utils";
import { lucia } from "@/server/auth/init";
import { db } from "@/server/db";
import { loginSchema, type loginSchemaType } from "@/validators/auth";
import { cookies } from "next/headers";
import { ActionResponse } from "./general";

export async function login(data: loginSchemaType) {
  try {
    const { success } = loginSchema.safeParse(data);

    if (!success) return ActionResponse.error("Invalid arguments");

    const userId = unformatId(data.code);
    console.log(data.code, userId);

    if (!userId) return ActionResponse.error("Incorrect username or password");

    const existingUser = await db.user.findUnique({ where: { id: userId } });

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

  return ActionResponse.redirect("/dashboard");
}
