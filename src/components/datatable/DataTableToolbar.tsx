import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholderSearchInput: string;
  children?: React.ReactNode;
  selectFilters?: {
    column: string;
    options?: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  placeholderSearchInput,
  children,
  selectFilters = [],
}: DataTableToolbarProps<TData>) {
  const globalSearch = table.getState().globalFilter as string;
  const isFiltered =
    globalSearch.length > 1 ||
    table.getState().columnFilters.length > 0 ||
    table.getState().sorting.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          value={globalSearch}
          placeholder={placeholderSearchInput}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {selectFilters.map(({ column, options }) => {
          if (table.getColumn(column))
            return (
              <DataTableFacetedFilter
                key={column}
                column={table.getColumn(column)!}
                title={column}
                options={options}
              />
            );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
              table.resetSorting();
            }}
          >
            <Cross2Icon className="size-4" />
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
