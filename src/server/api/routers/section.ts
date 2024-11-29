import { sectionEditServerSchema, sectionSchema } from "@/validators/section";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const sectionRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) =>
    ctx.db.section.findMany({
      include: { _count: { select: { products: true } } },
    }),
  ),
  create: adminProcedure
    .input(sectionSchema)
    .mutation(({ ctx, input: sectionData }) =>
      ctx.db.section.create({ data: sectionData }),
    ),
  edit: adminProcedure
    .input(sectionEditServerSchema)
    .mutation(({ ctx, input: { sectionId, ...sectionData } }) =>
      ctx.db.section.update({ data: sectionData, where: { id: sectionId } }),
    ),
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      try {
        return await ctx.db.section.delete({ where: { id } });
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Esta categoria tiene al menos un producto relacionado",
        });
      }
    }),
});
