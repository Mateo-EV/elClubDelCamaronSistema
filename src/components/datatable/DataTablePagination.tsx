"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { memo, useCallback } from "react";
import { Button } from "../ui/button";
import { PaginationEllipsis, PaginationLink } from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex } = table.getState().pagination;
  const setPageIndex = useCallback((n: number) => {
    table.setPageIndex(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getRowModel().rows.length} de {table.getRowCount()}{" "}
      </div>
      <div className="flex items-center space-x-2 lg:space-x-8">
        <div className="hidden items-center space-x-2 md:flex">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleArrowLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <div className="hidden lg:flex">
            <ArrayPagination
              pageIndex={pageIndex}
              countPages={table.getPageCount()}
              setPageIndex={setPageIndex}
            />
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <DoubleArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const ArrayPagination = memo(
  ({
    pageIndex,
    countPages,
    setPageIndex,
  }: {
    pageIndex: number;
    countPages: number;
    setPageIndex: (index: number) => void;
  }) => {
    const countPagesMayorThanSeven = countPages > 7;

    return Array.from(
      { length: countPagesMayorThanSeven ? 7 : countPages },
      (_, index) => {
        if (countPagesMayorThanSeven) {
          if (pageIndex <= 3) {
            if (index === 5) return <PaginationEllipsis key={index} />;
            if (index === 6)
              return (
                <PaginationLink
                  key={index}
                  onClick={() => setPageIndex(countPages - 1)}
                >
                  {countPages}
                </PaginationLink>
              );
            return (
              <PaginationLink
                key={index}
                isActive={pageIndex === index}
                onClick={() => setPageIndex(index)}
              >
                {index + 1}
              </PaginationLink>
            );
          }

          if (pageIndex >= countPages - 4) {
            if (index === 0)
              return (
                <PaginationLink key={index} onClick={() => setPageIndex(index)}>
                  1
                </PaginationLink>
              );

            if (index === 1) return <PaginationEllipsis key={index} />;
            return (
              <PaginationLink
                key={index}
                isActive={pageIndex === countPages + index - 7}
                onClick={() => setPageIndex(countPages + index - 7)}
              >
                {countPages + index - 6}
              </PaginationLink>
            );
          }

          if (index === 0)
            return (
              <PaginationLink key={index} onClick={() => setPageIndex(index)}>
                1
              </PaginationLink>
            );
          if (index === 6)
            return (
              <PaginationLink
                key={index}
                onClick={() => setPageIndex(countPages - 1)}
              >
                {countPages}
              </PaginationLink>
            );
          if (index === 1 || index === 5)
            return <PaginationEllipsis key={index} />;

          return (
            <PaginationLink
              key={index}
              isActive={pageIndex === pageIndex + index - 3}
              onClick={() => setPageIndex(pageIndex + index - 3)}
            >
              {pageIndex + index - 2}
            </PaginationLink>
          );
        }

        return (
          <PaginationLink
            key={index}
            isActive={pageIndex === index}
            onClick={() => setPageIndex(index)}
          >
            {index + 1}
          </PaginationLink>
        );
      },
    );
  },
);
ArrayPagination.displayName = "ArrayPagination";
