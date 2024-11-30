"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CookingPotIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  NotebookPenIcon,
  SquareMenuIcon,
  TargetIcon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Pedidos", url: "/pedidos", icon: NotebookPenIcon },
  { name: "Usuarios", url: "/usuarios", icon: Users2Icon },
  { name: "Clientes", url: "/clientes", icon: TargetIcon },
  { name: "Productos", url: "/productos", icon: CookingPotIcon },
  { name: "Categorías", url: "/categorias", icon: SquareMenuIcon },
  { name: "Secciones", url: "/secciones", icon: LayoutTemplateIcon },
];

export const AppSidebarContent = () => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  function closeSidebar() {
    setOpenMobile(false);
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Gestión</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url} onClick={closeSidebar}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};
