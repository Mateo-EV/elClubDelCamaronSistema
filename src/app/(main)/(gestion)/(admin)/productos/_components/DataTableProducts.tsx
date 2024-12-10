"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { CreateProductForm } from "./CreateProductForm";
import { productsTableColums } from "./DataTableProductsColumns";

export const DataTableProducts = () => {
  const [products] = api.product.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={products}
      columns={productsTableColums}
      placeholderSearchInput="Filtrar productos..."
      selectFilters={[
        {
          column: "Categoría",
        },
        {
          column: "Sección",
        },
      ]}
    >
      <ModalResponsive
        title="Nuevo Producto"
        description="Registre un nuevo producto"
        trigger={
          <Button size="sm">
            <PlusIcon className="size-4" />
            Crear Producto
          </Button>
        }
      >
        <CreateProductForm />
      </ModalResponsive>
    </DataTable>
  );
};
