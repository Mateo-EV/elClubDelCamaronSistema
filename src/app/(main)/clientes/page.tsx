import { DataTableSkeleton } from "@/components/datatable/DataTableSkeleton";
import { getSession } from "@/server/auth/session";
import { api, HydrateClient } from "@/trpc/server";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DataTableClients } from "./_components/DataTableClients";

export default async function ClientsPage() {
  const session = (await getSession())!;

  if (
    session.user.role !== UserRole.ADMIN &&
    session.user.role !== UserRole.HOST
  ) {
    return notFound();
  }

  void api.customer.getAll.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<DataTableSkeleton />}>
        <DataTableClients />
      </Suspense>
    </HydrateClient>
  );
}
