import { Skeleton } from "@/components/ui/skeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { OrdersList } from "./_components/OrdersList";
import { getSession } from "@/server/auth/session";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function AssingmentsPage() {
  const session = (await getSession())!;

  if (session.user.role !== UserRole.WAITER) {
    return notFound();
  }

  void api.waiter.getMyOrdersFromToday.prefetch();

  return (
    <div className="container mx-auto p-6">
      <HydrateClient>
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <Skeleton className="h-60 w-full" />
              <Skeleton className="h-60 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
          }
        >
          <OrdersList />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
