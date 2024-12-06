import { tableEditServerSchema, tableSchema } from "@/validators/table";
import {
  adminOrHostProcedure,
  adminProcedure,
  createTRPCRouter,
} from "../trpc";

export const tableRouter = createTRPCRouter({
  getAll: adminOrHostProcedure.query(({ ctx }) => ctx.db.table.findMany()),
  create: adminProcedure
    .input(tableSchema)
    .mutation(({ ctx, input: tableData }) =>
      ctx.db.table.create({ data: tableData }),
    ),
  edit: adminProcedure
    .input(tableEditServerSchema)
    .mutation(({ ctx, input: { tableId, ...tableData } }) =>
      ctx.db.table.update({ data: tableData, where: { id: tableId } }),
    ),
});
