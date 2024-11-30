import { OrderStatus } from "@prisma/client";

export const ORDER_STATUS = {
  [OrderStatus.Pending]: "Pendiente",
  [OrderStatus.InProcess]: "En Proceso",
  [OrderStatus.Canceled]: "Cancelado",
  [OrderStatus.Completed]: "Completado",
};
