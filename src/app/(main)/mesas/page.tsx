import { api, HydrateClient } from "@/trpc/server";
import { TableGrid } from "./_components/TableGrid";

export default function TablesPage() {
  void api.table.getAll.prefetch();

  return (
    <HydrateClient>
      <TableGrid />
    </HydrateClient>
  );
}
