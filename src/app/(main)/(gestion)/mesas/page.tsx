import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { TableContentPage } from "./_components/TableContentPage";
import TableSkeletonPage from "./_components/TableSkeletonPage";

export default async function TablesPage() {
  void api.table.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<TableSkeletonPage />}>
        <TableContentPage />
      </Suspense>
    </HydrateClient>
  );
}
