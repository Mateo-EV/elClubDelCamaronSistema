import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const clientRouter = createTRPCRouter({
  client: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.client.findMany();
  }),
});
