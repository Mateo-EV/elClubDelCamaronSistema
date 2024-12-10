import { getSession } from "@/server/auth/session";
import { TRPCReactProvider } from "@/trpc/react";
import { redirect } from "next/navigation";
import AuthProvider from "@/providers/AuthProvider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <AuthProvider session={session}>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </AuthProvider>
  );
}
