"use client";

import { type getSession } from "@/server/auth/session";
import React, { createContext, useContext } from "react";

type AuthContextProps = NonNullable<Awaited<ReturnType<typeof getSession>>>;

const AuthContext = createContext<AuthContextProps>(null!);

export default function AuthProvider({
  session,
  children,
}: {
  session: AuthContextProps;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
