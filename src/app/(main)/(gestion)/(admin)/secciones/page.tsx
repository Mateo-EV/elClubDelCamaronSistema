import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { DataTableSections } from "./_components/DataTableSections";

export default function CategoriesPage() {
  void api.section.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableSections />
      </Suspense>
    </HydrateClient>
  );
}
