import { getTodayFilters } from "@/lib/utils";
import {
  waitlistEditServerSchema,
  waitlistSchema,
  waitlistSeatSchema,
} from "@/validators/waitlist";
import {
  OrderStatus,
  TableStatus,
  UserRole,
  WaitlistStatus,
} from "@prisma/client";
import { z } from "zod";
import { adminOrHostProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";

export const waitlistRouter = createTRPCRouter({
  getAll: adminOrHostProcedure.query(async ({ ctx }) =>
    ctx.db.waitlist.findMany({
      include: { client: true },
      where:
        ctx.session.user.role === UserRole.ADMIN
          ? undefined
          : { reservationTime: getTodayFilters() },
    }),
  ),
  create: adminOrHostProcedure
    .input(waitlistSchema)
    .mutation(({ ctx, input: waitlistData }) =>
      ctx.db.waitlist.create({ data: waitlistData, include: { client: true } }),
    ),
  edit: adminOrHostProcedure
    .input(waitlistEditServerSchema)
    .mutation(({ ctx, input: { waitlistId, ...waitlistData } }) =>
      ctx.db.waitlist.update({
        data: waitlistData,
        where: { id: waitlistId },
        include: { client: true },
      }),
    ),
  delete: adminOrHostProcedure
    .input(z.number())
    .mutation(({ ctx, input: id }) =>
      ctx.db.waitlist.delete({ where: { id } }),
    ),
  cancel: adminOrHostProcedure
    .input(z.number())
    .mutation(({ ctx, input: id }) =>
      ctx.db.waitlist.update({
        data: { status: WaitlistStatus.Cancelled },
        where: { id },
        include: { client: true },
      }),
    ),
  seat: adminOrHostProcedure
    .input(waitlistSeatSchema)
    .mutation(async ({ ctx, input: { waitlistId, ...orderData } }) => {
      const waitlist = await ctx.db.waitlist.findUnique({
        where: { id: waitlistId },
      });

      if (!waitlist) throw new TRPCError({ code: "BAD_REQUEST" });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, waiterUpdated, waitlistUpdated] = await ctx.db.$transaction([
        ctx.db.order.create({
          data: {
            status: OrderStatus.Pending,
            total: 0,
            clientId: waitlist.clientId,
            ...orderData,
          },
        }),
        ctx.db.user.update({
          data: { activeOrdersCount: { increment: 1 } },
          where: { id: orderData.waiterId },
        }),
        ctx.db.waitlist.update({
          data: { status: WaitlistStatus.Seated, seatedTime: new Date() },
          where: { id: waitlistId },
          include: { client: true },
        }),
        ctx.db.table.update({
          data: { status: TableStatus.Occupied },
          where: { id: orderData.tableId },
        }),
      ]);

      return { waiterUpdated, waitlistUpdated };
    }),
});
