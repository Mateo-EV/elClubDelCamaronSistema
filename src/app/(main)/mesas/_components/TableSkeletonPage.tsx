import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeletonPage() {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between py-2">
        <Skeleton className="h-10 w-1/3" /> <Skeleton className="h-10 w-24" />{" "}
      </div>

      <div className="flex flex-wrap gap-6">
        {Array.from({ length: 15 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-[160px]" />
        ))}
      </div>
    </div>
  );
}
