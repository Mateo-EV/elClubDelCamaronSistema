import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/server/auth/session";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { AppSidebar } from "./_components/AppSidebar";
import { Header } from "./_components/Header";

export default async function GestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getSession())!;

  if (
    session.user.role !== UserRole.ADMIN &&
    session.user.role !== UserRole.HOST
  ) {
    return notFound();
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex-1 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
