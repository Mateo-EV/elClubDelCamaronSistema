import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const customerRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.client.findMany();
  }),
});
