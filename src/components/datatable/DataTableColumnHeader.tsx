import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { type Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-xs", className)}>{column.id}</div>;
  }

  const isAscSorted = column.getIsSorted() === "asc";

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(isAscSorted)}
      >
        <span>{column.id}</span>
        {isAscSorted ? (
          <ArrowDownIcon className="ml-2 size-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowUpIcon className="ml-2 size-4" />
        ) : (
          <CaretSortIcon className="ml-2 size-4" />
        )}
      </Button>
    </div>
  );
}
