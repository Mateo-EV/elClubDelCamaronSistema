import {
  orderAdminCreateSchema,
  orderAdminEditSchema,
} from "@/validators/order";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const orderRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) =>
    ctx.db.order.findMany({
      include: {
        client: { select: { firstName: true, lastName: true } },
        waiter: { select: { firstName: true, lastName: true } },
      },
    }),
  ),
  create: adminProcedure
    .input(orderAdminCreateSchema)
    .mutation(async ({ ctx, input: { details, ...orderData } }) => {
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

      return await ctx.db.order.create({
        data: {
          total,
          ...orderData,
          details: {
            createMany: {
              data: details.map((detail) => ({
                ...detail,
                unitPrice: productsIndexedById[detail.productId]!.price,
              })),
            },
          },
        },
        include: {
          client: { select: { firstName: true, lastName: true } },
          waiter: { select: { firstName: true, lastName: true } },
        },
      });
    }),
  getById: adminProcedure
    .input(z.number())
    .query(async ({ ctx, input: orderId }) =>
      ctx.db.order.findUnique({
        where: { id: orderId },
        include: { details: true },
      }),
    ),
  edit: adminProcedure
    .input(orderAdminEditSchema)
    .mutation(async ({ ctx, input: { details, orderId, ...orderData } }) => {
      const orderExists = await ctx.db.order.findUnique({
        where: { id: orderId },
        select: { id: true },
      });

      if (!orderExists) throw new TRPCError({ code: "BAD_REQUEST" });

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
        where: { id: orderId },
        data: {
          ...orderData,
          total,
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
        include: {
          client: { select: { firstName: true, lastName: true } },
          waiter: { select: { firstName: true, lastName: true } },
        },
      });
    }),
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      try {
        return await ctx.db.order.delete({ where: { id } });
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});
