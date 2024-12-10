import { getSession } from "@/server/auth/session";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getSession())!;

  if (session.user.role !== UserRole.HOST) return notFound();

  return children;
}
