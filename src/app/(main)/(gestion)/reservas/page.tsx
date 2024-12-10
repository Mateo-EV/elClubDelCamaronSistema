import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { DataTableReservations } from "./_components/DataTableReservations";

export default function ReservationsPage() {
  void api.reservation.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableReservations />
      </Suspense>
    </HydrateClient>
  );
}
