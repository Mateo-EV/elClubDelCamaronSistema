import { UserRole } from "@prisma/client";
import {
  ChefHatIcon,
  HandPlatterIcon,
  PersonStandingIcon,
  ShieldIcon,
} from "lucide-react";

export const ROLES_DATA = {
  [UserRole.ADMIN]: {
    name: "Admin",
    icon: ShieldIcon,
  },
  [UserRole.CHEF]: {
    name: "Chef",
    icon: ChefHatIcon,
  },
  [UserRole.HOST]: {
    name: "Host",
    icon: PersonStandingIcon,
  },
  [UserRole.WAITER]: {
    name: "Mozo",
    icon: HandPlatterIcon,
  },
};
