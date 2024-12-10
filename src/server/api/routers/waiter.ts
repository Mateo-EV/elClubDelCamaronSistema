import { getTodayFilters } from "@/lib/utils";
import { createTRPCRouter, waiterProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { OrderStatus, TableStatus } from "@prisma/client";
import { orderWaiterProcessSchema } from "@/validators/order";

export const waiterRouter = createTRPCRouter({
  getMyOrdersFromToday: waiterProcedure.query(({ ctx }) =>
    ctx.db.order.findMany({
      where: { createdAt: getTodayFilters(), waiterId: ctx.session.user.id },
      include: { client: true },
    }),
  ),
  getOrderDetail: waiterProcedure
    .input(z.number())
    .query(({ ctx, input: orderId }) =>
      ctx.db.order.findUnique({
        where: {
          id: orderId,
          waiterId: ctx.session.user.id,
          createdAt: getTodayFilters(),
        },
        include: {
          details: true,
        },
      }),
    ),
  cancelOrder: waiterProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: orderId }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: orderId,
          waiterId: ctx.session.user.id,
          createdAt: getTodayFilters(),
        },
      });

      if (
        !order ||
        order.status === OrderStatus.Completed ||
        order.status === OrderStatus.Canceled
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

      const [orderUpdated] = await ctx.db.$transaction([
        ctx.db.order.update({
          where: {
            id: orderId,
          },
          data: { status: OrderStatus.Canceled },
          include: { client: true },
        }),
        ctx.db.user.update({
          where: { id: order.waiterId },
          data: { activeOrdersCount: { decrement: 1 } },
        }),
        ctx.db.table.update({
          data: { status: TableStatus.Available },
          where: { id: order.tableId },
        }),
      ]);

      return orderUpdated;
    }),
  proccessOrder: waiterProcedure
    .input(orderWaiterProcessSchema)
    .mutation(async ({ ctx, input: { orderId, details, notes } }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: orderId,
          waiterId: ctx.session.user.id,
          createdAt: getTodayFilters(),
        },
        select: { status: true },
      });

      if (!order || order.status !== OrderStatus.Pending)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const productIds = details.map(({ productId }) => productId);

      const productsSelected = await ctx.db.product.findMany({
        where: { id: { in: productIds } },
      });
      const productsIndexedById = productsSelected.reduce<
        Record<number, (typeof productsSelected)[number]>
      >((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});

      if (productsSelected.length !== productIds.length)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const total = details.reduce(
        (acc, curr) =>
          acc + curr.quantity * productsIndexedById[curr.productId]!.price,
        0,
      );

      return await ctx.db.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.InProcess,
          total,
          notes,
          details: {
            deleteMany: {},
            createMany: {
              data: details.map((detail) => ({
                ...detail,
                unitPrice: productsIndexedById[detail.productId]!.price,
              })),
            },
          },
        },
        include: { client: true },
      });
    }),
  editProcessingOrder: waiterProcedure
    .input(orderWaiterProcessSchema)
    .mutation(async ({ ctx, input: { details, orderId, notes } }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: orderId,
          waiterId: ctx.session.user.id,
          createdAt: getTodayFilters(),
        },
        select: { status: true },
      });

      if (
        !order ||
        (order.status !== OrderStatus.InProcess &&
          order.status !== OrderStatus.Send)
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

      const productIds = details.map(({ productId }) => productId);

      const productsSelected = await ctx.db.product.findMany({
        where: { id: { in: productIds } },
      });
      const productsIndexedById = productsSelected.reduce<
        Record<number, (typeof productsSelected)[number]>
      >((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {});

      if (productsSelected.length !== productIds.length)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const total = details.reduce(
        (acc, curr) =>
          acc + curr.quantity * productsIndexedById[curr.productId]!.price,
        0,
      );

      return await ctx.db.order.update({
        where: {
          id: orderId,
        },
        data: {
          total,
          notes,
          status: OrderStatus.InProcess,
          details: {
            deleteMany: {},
            createMany: {
              data: details.map((detail) => ({
                ...detail,
                unitPrice: productsIndexedById[detail.productId]!.price,
              })),
            },
          },
        },
        include: { client: true },
      });
    }),
  completeOrder: waiterProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: orderId }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: orderId,
          createdAt: getTodayFilters(),
          waiterId: ctx.session.user.id,
        },
        select: { status: true, waiterId: true },
      });

      if (!order || order.status !== OrderStatus.Send)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const [orderUpdated] = await ctx.db.$transaction([
        ctx.db.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.Completed },
          include: { client: true },
        }),
        ctx.db.user.update({
          where: { id: order.waiterId },
          data: { activeOrdersCount: { decrement: 1 } },
        }),
        ctx.db.table.update({
          data: { status: TableStatus.Available },
          where: { id: orderId },
        }),
      ]);

      return orderUpdated;
    }),
});
