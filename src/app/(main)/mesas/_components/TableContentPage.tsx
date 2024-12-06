"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type TableStatus } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateTableForm } from "./CreateTableForm";
import { TableFilters } from "./TableFilters";
import { TableGrid } from "./TableGrid";

export const TableContentPage = () => {
  const [tables] = api.table.getAll.useSuspenseQuery();
  const [statusFilter, setStatusFilter] = useState<TableStatus | "all">("all");
  const [sortCapacityOrder, setSortCapacityOrder] = useState<
    "desc" | "asc" | null
  >(null);

  const tablesFiltered = useMemo(() => {
    let result = tables;

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (sortCapacityOrder) {
      if (sortCapacityOrder === "desc") {
        result = [...result].sort((a, b) => b.capacity - a.capacity);
      } else {
        result = [...result].sort((a, b) => a.capacity - b.capacity);
      }
    }

    return result;
  }, [sortCapacityOrder, statusFilter, tables]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TableFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortCapacityOrder={sortCapacityOrder}
          setSortCapacityOrder={setSortCapacityOrder}
        />
        <ModalResponsive
          title="Nueva Mesa"
          description="Registre una nueva mesa"
          trigger={
            <Button size="sm">
              <PlusIcon className="size-4" />
              Crear Mesa
            </Button>
          }
        >
          <CreateTableForm />
        </ModalResponsive>
      </div>
      <TableGrid tables={tablesFiltered} />
    </div>
  );
};
