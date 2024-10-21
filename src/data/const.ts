import { UserRole } from "@prisma/client";

export const ROLES_DATA = {
  [UserRole.ADMIN]: {
    name: "Admin",
  },
  [UserRole.CHEF]: {
    name: "Chef",
  },
  [UserRole.HOST]: {
    name: "Host",
  },
  [UserRole.WAITER]: {
    name: "Mozo",
  },
};
