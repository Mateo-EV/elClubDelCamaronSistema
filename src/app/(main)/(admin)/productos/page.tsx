import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { DataTableProducts } from "./_components/DataTableProducts";

export default async function ProductsPage() {
  void api.product.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableProducts />
      </Suspense>
    </HydrateClient>
  );
}
