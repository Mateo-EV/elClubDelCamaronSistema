import {
  OrderStatus,
  ReservationStatus,
  TableStatus,
  UserRole,
  WaitlistStatus,
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
  [OrderStatus.Send]: "Entregado",
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

export const WAITLIST_STATUS = {
  [WaitlistStatus.Waiting]: "Esperando",
  [WaitlistStatus.Cancelled]: "Cancelado",
  [WaitlistStatus.Seated]: "Asignado",
};

export const LOGIN_REDIRECT_ROLE = {
  [UserRole.ADMIN]: "/dashboard",
  [UserRole.CHEF]: "/cocina",
  [UserRole.HOST]: "/lista-de-espera",
  [UserRole.WAITER]: "/asignaciones",
};
