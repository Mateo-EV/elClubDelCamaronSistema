import {
  reservationEditServerSchema,
  reservationSchema,
} from "@/validators/reservation";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const reservationRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) =>
    ctx.db.reservation.findMany({ include: { client: true } }),
  ),
  create: adminProcedure
    .input(reservationSchema)
    .mutation(({ ctx, input: reservationData }) =>
      ctx.db.reservation.create({
        data: reservationData,
        include: { client: true },
      }),
    ),
  edit: adminProcedure
    .input(reservationEditServerSchema)
    .mutation(({ ctx, input: { reservationId, ...reservationData } }) =>
      ctx.db.reservation.update({
        data: reservationData,
        where: { id: reservationId },
        include: { client: true },
      }),
    ),
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      return await ctx.db.reservation.delete({
        where: { id },
      });
    }),
});
