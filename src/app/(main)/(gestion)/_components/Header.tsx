"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { AuthAvatar } from "../../_components/AuthAvatar";
import { useAuth } from "@/providers/AuthProvider";
import { UserRole } from "@prisma/client";

export const Header = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const pathnameDivided = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {user.role === UserRole.ADMIN && (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    Gestión
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
              {pathnameDivided.map((path, index) => (
                <>
                  <BreadcrumbItem
                    className="hidden capitalize md:block"
                    key={path}
                  >
                    {index === pathnameDivided.length - 1 ? (
                      <BreadcrumbPage>
                        {path.split("-").join(" ")}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={`${pathnameDivided
                          .slice(0, index)
                          .map((path) => `/${path}`)
                          .join("")}/${path}`}
                      >
                        {path}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index !== pathnameDivided.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <AuthAvatar />
      </div>
    </header>
  );
};
