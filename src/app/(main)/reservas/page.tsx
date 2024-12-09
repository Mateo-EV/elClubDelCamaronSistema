import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { DataTableReservations } from "./_components/DataTableReservations";
import { getSession } from "@/server/auth/session";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function ReservationsPage() {
  const session = (await getSession())!;

  if (
    session.user.role !== UserRole.ADMIN &&
    session.user.role !== UserRole.HOST
  ) {
    return notFound();
  }

  void api.reservation.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableReservations />
      </Suspense>
    </HydrateClient>
  );
}
