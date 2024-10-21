import { adminProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) =>
    ctx.db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        email: true,
        phone: true,
        dni: true,
        role: true,
        createdAt: true,
      },
    }),
  ),
});
