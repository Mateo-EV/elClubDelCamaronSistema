"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { api } from "@/trpc/react";
import { ordersTableColums } from "./DatatableOrdersColumns";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const DataTableOrders = () => {
  const [orders] = api.order.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={orders}
      columns={ordersTableColums}
      selectFilters={[{ column: "Estado" }]}
      placeholderSearchInput="Filtrar pedidos..."
    >
      <Link href="/pedidos/crear" className={buttonVariants({ size: "sm" })}>
        <PlusIcon className="size-4" />
        Crear Pedido
      </Link>
    </DataTable>
  );
};
