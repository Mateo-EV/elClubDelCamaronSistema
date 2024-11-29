import {
  categoryEditServerSchema,
  categorySchema,
} from "@/validators/category";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) =>
    ctx.db.category.findMany({
      include: { _count: { select: { products: true } } },
    }),
  ),
  create: adminProcedure
    .input(categorySchema)
    .mutation(({ ctx, input: categoryData }) =>
      ctx.db.category.create({ data: categoryData }),
    ),
  edit: adminProcedure
    .input(categoryEditServerSchema)
    .mutation(({ ctx, input: { categoryId, ...categoryData } }) =>
      ctx.db.category.update({ data: categoryData, where: { id: categoryId } }),
    ),
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      try {
        return await ctx.db.category.delete({ where: { id } });
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Esta categoria tiene al menos un producto relacionado",
        });
      }
    }),
});
