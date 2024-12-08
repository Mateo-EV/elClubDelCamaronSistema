import { orderAdminCreateSchema } from "@/validators/order";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";

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
      });
    }),
});
