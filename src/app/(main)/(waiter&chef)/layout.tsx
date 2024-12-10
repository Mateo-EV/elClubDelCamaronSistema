import { getSession } from "@/server/auth/session";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import Header from "./_components/Header";

export default async function WaiterAndChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getSession())!;

  if (
    session.user.role !== UserRole.WAITER &&
    session.user.role !== UserRole.CHEF
  ) {
    return notFound();
  }

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
