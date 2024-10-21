import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/server/auth/session";
import { TRPCReactProvider } from "@/trpc/react";
import { AppSidebar } from "./_components/AppSidebar";
import { Header } from "./_components/Header";
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <TRPCReactProvider>
            <div className="flex-1 p-4 pt-0">{children}</div>
          </TRPCReactProvider>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
