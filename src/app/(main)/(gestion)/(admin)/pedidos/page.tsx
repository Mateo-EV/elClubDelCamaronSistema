import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { DataTableOrders } from "./_components/DatatableOrders";

export default function OrdersPage() {
  void api.order.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableOrders />
      </Suspense>
    </HydrateClient>
  );
}
