import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { DataTableClients } from "./_components/DataTableClients";

export default function ClientsPage() {
  void api.customer.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableClients />
      </Suspense>
    </HydrateClient>
  );
}
