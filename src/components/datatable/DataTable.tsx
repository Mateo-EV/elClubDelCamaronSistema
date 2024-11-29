"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TableRowLib,
} from "@/components/ui/table";
import { useState } from "react";
import { useSidebar } from "../ui/sidebar";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";

interface DataTableProps<
  TData,
  TValue,
  ColumnDefT extends ColumnDef<TData, TValue>[],
> {
  columns: ColumnDefT;
  data: TData[];
  placeholderSearchInput: string;
  children?: React.ReactNode;
  selectFilters?: {
    column: NonNullable<ColumnDefT[number]["id"]>;
    options?: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function DataTable<
  TData,
  TValue,
  ColumnDefT extends ColumnDef<TData, TValue>[],
>({
  columns,
  data,
  placeholderSearchInput,
  children,
  selectFilters = [],
}: DataTableProps<TData, TValue, ColumnDefT>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    defaultColumn: {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <DataTableContainer>
      <DataTableToolbar
        table={table}
        selectFilters={selectFilters}
        placeholderSearchInput={placeholderSearchInput}
      >
        {children}
      </DataTableToolbar>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <AnimatePresence>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow key="anyone">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay resultados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </AnimatePresence>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </DataTableContainer>
  );
}

function DataTableContainer({ children }: { children: React.ReactNode }) {
  const { isMobile, open } = useSidebar();

  const maxWidth = isMobile
    ? "calc(100vw - 2rem)"
    : open
      ? "calc(100vw - 18rem)"
      : "calc(100vw - 5rem)";

  return (
    <div className="space-y-4" style={{ maxWidth }}>
      {children}
    </div>
  );
}

const TableRowMotion = motion(TableRowLib);

function TableRow(
  props: React.ComponentPropsWithoutRef<typeof TableRowMotion>,
) {
  const isPresent = useIsPresent();

  return (
    <TableRowMotion
      {...props}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: isPresent ? "relative" : "absolute",
        display: isPresent ? "table-row" : "flex",
        alignItems: isPresent ? "" : "center",
      }}
    />
  );
}
