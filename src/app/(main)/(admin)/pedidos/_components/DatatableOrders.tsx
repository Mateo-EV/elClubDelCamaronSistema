"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { api } from "@/trpc/react";
import { ordersTableColums } from "./DatatableOrdersColumns";

export const DataTableOrders = () => {
  const [orders] = api.order.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={orders}
      columns={ordersTableColums}
      placeholderSearchInput="Filtrar pedidos..."
    />
  );
};
