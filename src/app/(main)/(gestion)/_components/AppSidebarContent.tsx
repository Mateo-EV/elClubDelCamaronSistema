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
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/providers/AuthProvider";
import { UserRole } from "@prisma/client";
import {
  BetweenVerticalEnd,
  CalendarIcon,
  CookingPotIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  ListIcon,
  NotebookPenIcon,
  SquareMenuIcon,
  TargetIcon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItems = {
  [UserRole.ADMIN]: [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    { name: "Pedidos", url: "/pedidos", icon: NotebookPenIcon },
    { name: "Reservas", url: "/reservas", icon: CalendarIcon },
    { name: "Usuarios", url: "/usuarios", icon: Users2Icon },
    { name: "Clientes", url: "/clientes", icon: TargetIcon },
    { name: "Productos", url: "/productos", icon: CookingPotIcon },
    { name: "Categorías", url: "/categorias", icon: SquareMenuIcon },
    { name: "Secciones", url: "/secciones", icon: LayoutTemplateIcon },
    { name: "Mesas", url: "/mesas", icon: BetweenVerticalEnd },
  ],
  [UserRole.HOST]: [
    { name: "Lista de Espera", url: "/lista-de-espera", icon: ListIcon },
    { name: "Clientes", url: "/clientes", icon: TargetIcon },
    { name: "Mesas", url: "/mesas", icon: BetweenVerticalEnd },
    { name: "Reservas", url: "/reservas", icon: CalendarIcon },
  ],
  [UserRole.WAITER]: [],
  [UserRole.CHEF]: [],
};

export const AppSidebarContent = () => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { user } = useAuth();

  function closeSidebar() {
    setOpenMobile(false);
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        {user.role === UserRole.ADMIN && (
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
        )}
        <TooltipProvider delayDuration={0}>
          <SidebarMenu>
            {SidebarItems[user.role].map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === item.url || pathname.startsWith(item.url)
                  }
                  tooltip={item.name}
                >
                  <Link href={item.url} onClick={closeSidebar}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarGroup>
    </SidebarContent>
  );
};
