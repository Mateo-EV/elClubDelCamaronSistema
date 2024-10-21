import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarContent } from "./AppSidebarContent";
import { AppSidebarFooter } from "./AppSidebarFooter";
import { AppSidebarHeader } from "./AppSidebarHeader";

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter />
    </Sidebar>
  );
};
