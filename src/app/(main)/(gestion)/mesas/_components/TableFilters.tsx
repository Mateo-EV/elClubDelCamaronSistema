"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TABLE_STATUS } from "@/data/const";
import { type TableStatus } from "@prisma/client";
import { XIcon } from "lucide-react";

type TableFiltersProps = {
  statusFilter: TableStatus | "all";
  sortCapacityOrder: "desc" | "asc" | null;
  setStatusFilter: React.Dispatch<React.SetStateAction<TableStatus | "all">>;
  setSortCapacityOrder: React.Dispatch<
    React.SetStateAction<"desc" | "asc" | null>
  >;
};

export const TableFilters = ({
  statusFilter,
  sortCapacityOrder,
  setStatusFilter,
  setSortCapacityOrder,
}: TableFiltersProps) => {
  return (
    <div className="flex justify-center gap-4">
      <div className="flex items-center">
        <label className="mr-4 hidden text-sm font-semibold lg:inline">
          Estado:
        </label>
        <Select
          onValueChange={(val) => setStatusFilter(val as typeof statusFilter)}
          value={statusFilter}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(TABLE_STATUS).map(([value, label]) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden items-center lg:flex">
        <label className="mr-4 hidden text-sm font-semibold lg:inline">
          Capacidad:
        </label>
        <Select
          onValueChange={(val) =>
            setSortCapacityOrder(val as typeof sortCapacityOrder)
          }
          value={sortCapacityOrder as string}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascendente</SelectItem>
            <SelectItem value="desc">Descendente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(Boolean(sortCapacityOrder) || statusFilter !== "all") && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setStatusFilter("all");
            setSortCapacityOrder(null);
          }}
        >
          <XIcon className="size-4" />
        </Button>
      )}
    </div>
  );
};
