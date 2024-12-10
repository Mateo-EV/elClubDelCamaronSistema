import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { DataTableWaitlist } from "./_components/DataTableWaitlist";

export default function WaitlistPage() {
  void api.waitlist.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableWaitlist />
      </Suspense>
    </HydrateClient>
  );
}
