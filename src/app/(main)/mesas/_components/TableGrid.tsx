"use client";

import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type TableStatus } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { TableCard } from "./TableCard";
import { TableFilters } from "./TableFilters";
import { AnimatePresence, motion } from "framer-motion";

const tableVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const TableGrid = () => {
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
          Mesa formulario
        </ModalResponsive>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
        <AnimatePresence mode="wait">
          {tablesFiltered.map((table) => (
            <motion.div
              key={table.id}
              layout
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TableCard table={table} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
