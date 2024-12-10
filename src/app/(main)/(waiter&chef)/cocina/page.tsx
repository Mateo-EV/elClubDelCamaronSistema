import { getSession } from "@/server/auth/session";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { OrdersList } from "./_components/OrderList";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ChefPage() {
  const session = (await getSession())!;

  if (session.user.role !== UserRole.CHEF) {
    return notFound();
  }

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
