import { adminOrHostProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  customerEditServerSchema,
  customerSchema,
} from "@/validators/customer";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const customerRouter = createTRPCRouter({
  getAll: adminOrHostProcedure.query(async ({ ctx }) =>
    ctx.db.client.findMany({
      include: { _count: { select: { orders: true, reservations: true } } },
    }),
  ),
  create: adminOrHostProcedure
    .input(customerSchema)
    .mutation(({ ctx, input: customerData }) =>
      ctx.db.client.create({ data: customerData }),
    ),
  edit: adminOrHostProcedure
    .input(customerEditServerSchema)
    .mutation(({ ctx, input: { clientId, ...customerData } }) =>
      ctx.db.client.update({ data: customerData, where: { id: clientId } }),
    ),
  delete: adminOrHostProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      try {
        return await ctx.db.client.delete({ where: { id } });
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este cliente tiene pedidos o reservas",
        });
      }
    }),
});
