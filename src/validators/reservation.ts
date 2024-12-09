import { ReservationStatus } from "@prisma/client";
import { z } from "zod";

export const reservationSchema = z.object({
  scheduledAt: z.date({ required_error: "La fecha programada es obligatoria" }),
  status: z.nativeEnum(ReservationStatus, {
    required_error: "El estado de la reservación es obligatoria",
  }),
  clientId: z.coerce.number({ message: "El cliente es obligatorio" }),
  tableId: z.coerce.number({ message: "La mesa es obligatoria" }),
});

export type reservationSchemaType = z.infer<typeof reservationSchema>;

export const reservationEditServerSchema = reservationSchema.extend({
  reservationId: z.number(),
});

export const confirmReservationSchema = z.object({
  waiterId: z.coerce.number({ message: "El mozo es obligatorio" }),
  reservationId: z.number(),
});
