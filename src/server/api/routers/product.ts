import { productEditServerSchema, productSchema } from "@/validators/product";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) =>
    ctx.db.product.findMany({
      include: {
        orderDetails: true,
        section: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),
  ),
  create: adminProcedure
    .input(productSchema)
    .mutation(({ ctx, input: productData }) =>
      ctx.db.product.create({
        data: productData,
        include: {
          section: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),
    ),
  edit: adminProcedure
    .input(productEditServerSchema)
    .mutation(({ ctx, input: { productId, ...productData } }) =>
      ctx.db.product.update({
        data: productData,
        where: { id: productId },
        include: {
          section: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),
    ),
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      try {
        return await ctx.db.product.delete({ where: { id } });
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Se ha hecho pedidos con este producto",
        });
      }
    }),
});
