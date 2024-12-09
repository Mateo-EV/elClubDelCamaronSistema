import { getTodayFilters } from "@/lib/utils";
import {
  confirmReservationSchema,
  reservationEditServerSchema,
  reservationSchema,
} from "@/validators/reservation";
import { OrderStatus, ReservationStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import {
  adminOrHostProcedure,
  adminProcedure,
  createTRPCRouter,
} from "../trpc";
import { TRPCError } from "@trpc/server";

export const reservationRouter = createTRPCRouter({
  getAll: adminOrHostProcedure.query(async ({ ctx }) =>
    ctx.db.reservation.findMany({
      include: { client: true },
      where:
        ctx.session.user.role === UserRole.ADMIN
          ? undefined
          : { scheduledAt: getTodayFilters() },
    }),
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
  cancel: adminOrHostProcedure
    .input(z.number())
    .mutation(({ ctx, input: id }) =>
      ctx.db.reservation.update({
        data: { status: ReservationStatus.Canceled },
        where: { id },
        include: { client: true },
      }),
    ),
  confirm: adminOrHostProcedure
    .input(confirmReservationSchema)
    .mutation(async ({ ctx, input: { reservationId, ...orderData } }) => {
      const reservation = await ctx.db.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) throw new TRPCError({ code: "BAD_REQUEST" });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, waiterUpdated, reservationUpdated] = await ctx.db.$transaction([
        ctx.db.order.create({
          data: {
            status: OrderStatus.Pending,
            total: 0,
            tableId: reservation.tableId,
            clientId: reservation.clientId,
            ...orderData,
          },
        }),
        ctx.db.user.update({
          data: { activeOrdersCount: { increment: 1 } },
          where: { id: orderData.waiterId },
        }),
        ctx.db.reservation.update({
          data: { status: ReservationStatus.Confirmed },
          where: { id: reservationId },
          include: { client: true },
        }),
      ]);

      return { waiterUpdated, reservationUpdated };
    }),
});
