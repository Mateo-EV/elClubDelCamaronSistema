import { api, HydrateClient } from "@/trpc/server";
import { TableContentPage } from "./_components/TableContentPage";
import { Suspense } from "react";
import TableSkeletonPage from "./_components/TableSkeletonPage";

export default function TablesPage() {
  void api.table.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<TableSkeletonPage />}>
        <TableContentPage />
      </Suspense>
    </HydrateClient>
  );
}
