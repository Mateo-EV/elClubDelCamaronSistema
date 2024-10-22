import { Skeleton } from "../ui/skeleton";

export function DataTableSkeleton() {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between py-2">
        <Skeleton className="h-10 w-1/3" /> <Skeleton className="h-10 w-24" />{" "}
      </div>

      <div className="flex items-center gap-4 py-2">
        <Skeleton className="h-10 w-full" /> {/* Código */}
        <Skeleton className="h-10 w-full" /> {/* Nombre */}
        <Skeleton className="h-10 w-full" /> {/* Rol */}
        <Skeleton className="h-10 w-full" /> {/* Estado */}
      </div>

      {/* Filas de la tabla */}
      <Skeleton className="h-[calc(100vh-20rem)] w-full" />

      {/* Paginación */}
      <div className="flex items-center justify-between py-2">
        <Skeleton className="h-6 w-32 rounded" /> {/* Información de filas */}
        <Skeleton className="h-8 w-1/3" /> {/* Paginación */}
      </div>
    </div>
  );
}
