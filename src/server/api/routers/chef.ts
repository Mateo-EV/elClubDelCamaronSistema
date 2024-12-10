import { getTodayFilters } from "@/lib/utils";
import { z } from "zod";
import { chefProcedure, createTRPCRouter } from "../trpc";
import { OrderStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const chefRouter = createTRPCRouter({
  getMyOrdersFromToday: chefProcedure.query(({ ctx }) =>
    ctx.db.order.findMany({
      where: {
        createdAt: getTodayFilters(),
        status: {
          not: OrderStatus.Pending,
        },
      },
      include: { waiter: true },
    }),
  ),
  getOrderDetail: chefProcedure
    .input(z.number())
    .query(({ ctx, input: orderId }) =>
      ctx.db.order.findUnique({
        where: {
          id: orderId,
          createdAt: getTodayFilters(),
        },
        include: {
          details: true,
        },
      }),
    ),
  sentOrder: chefProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: orderId }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: orderId,
          createdAt: getTodayFilters(),
        },
        select: { status: true, waiterId: true },
      });

      if (!order || order.status !== OrderStatus.InProcess)
        throw new TRPCError({ code: "BAD_REQUEST" });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orderUpdated = await ctx.db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.Send },
        include: { waiter: true },
      });

      return orderUpdated;
    }),
});
