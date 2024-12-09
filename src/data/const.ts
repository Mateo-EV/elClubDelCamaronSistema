import {
  OrderStatus,
  ReservationStatus,
  TableStatus,
  UserRole,
} from "@prisma/client";
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
export const ORDER_STATUS = {
  [OrderStatus.Pending]: "Pendiente",
  [OrderStatus.InProcess]: "En Proceso",
  [OrderStatus.Canceled]: "Cancelado",
  [OrderStatus.Completed]: "Completado",
};

export const TABLE_STATUS = {
  [TableStatus.Available]: "Disponible",
  [TableStatus.Occupied]: "En uso",
  [TableStatus.Reserved]: "Reservada",
};

export const RESERVATION_STATUS = {
  [ReservationStatus.Canceled]: "Cancelado",
  [ReservationStatus.Confirmed]: "Confirmado",
  [ReservationStatus.Pending]: "Pendiente",
};
