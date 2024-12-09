import { useAuth } from "@/providers/AuthProvider";
import { UserRole } from "@prisma/client";

export function useIsAdmin() {
  const { user } = useAuth();
  return user.role === UserRole.ADMIN;
}
