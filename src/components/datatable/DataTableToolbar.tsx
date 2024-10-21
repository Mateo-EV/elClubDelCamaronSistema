import { type Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Cross2Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { ArrowDownIcon, ArrowRightIcon, CircleIcon } from "lucide-react";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholderSearchInput: string;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  placeholderSearchInput,
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={placeholderSearchInput}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              {
                value: "backlog",
                label: "Backlog",
                icon: QuestionMarkCircledIcon,
              },
              {
                value: "todo",
                label: "Todo",
                icon: CircleIcon,
              },
            ]}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={[
              {
                label: "Low",
                value: "low",
                icon: ArrowDownIcon,
              },
              {
                label: "Medium",
                value: "medium",
                icon: ArrowRightIcon,
              },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
