import { SidebarProvider } from "@/components/ui/sidebar";
import { TRPCReactProvider } from "@/trpc/react";
import { AppSidebar } from "./_components/AppSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SidebarProvider>
  );
}
