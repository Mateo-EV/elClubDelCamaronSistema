"use client";

import { logout } from "@/actions/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { api } from "@/trpc/react";
import { LogOutIcon } from "lucide-react";
import { useTransition } from "react";

export const LogoutButton = () => {
  const [isPending, startTransition] = useTransition();
  const utils = api.useUtils();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    startTransition(async () => {
      await logout();
      void utils.invalidate();
    });
  };

  return (
    <DropdownMenuItem onClick={handleClick}>
      {isPending ? <LoadingSpinner /> : <LogOutIcon />}
      Cerrar Sesión
    </DropdownMenuItem>
  );
};
