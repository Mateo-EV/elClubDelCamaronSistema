import { api, HydrateClient } from "@/trpc/server";
import { DataTableUsers } from "./_components/DataTableUsers";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";

export default function UsersPage() {
  void api.user.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableUsers />
      </Suspense>
    </HydrateClient>
  );
}
