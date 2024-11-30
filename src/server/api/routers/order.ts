import { adminProcedure, createTRPCRouter } from "../trpc";

export const orderRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) =>
    ctx.db.order.findMany({
      include: {
        client: { select: { firstName: true, lastName: true } },
        paymentMethod: { select: { name: true } },
        waiter: { select: { firstName: true, lastName: true } },
      },
    }),
  ),
});
