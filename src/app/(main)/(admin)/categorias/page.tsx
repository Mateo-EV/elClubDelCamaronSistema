import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { DataTableCategories } from "./_components/DataTableCategories";

export default function CategoriesPage() {
  void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableCategories />
      </Suspense>
    </HydrateClient>
  );
}
