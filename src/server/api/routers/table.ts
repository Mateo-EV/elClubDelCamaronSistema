import { adminOrHostProcedure, createTRPCRouter } from "../trpc";

export const tableRouter = createTRPCRouter({
  getAll: adminOrHostProcedure.query(({ ctx }) => ctx.db.table.findMany()),
});
