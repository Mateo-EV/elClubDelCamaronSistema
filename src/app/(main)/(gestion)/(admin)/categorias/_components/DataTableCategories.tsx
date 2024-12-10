"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { CreateCategoryForm } from "./CreateCategoryForm";
import { categoriesTableColums } from "./DataTableCategoriesColumns";

export const DataTableCategories = () => {
  const [categories] = api.category.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={categories}
      columns={categoriesTableColums}
      placeholderSearchInput="Filtrar categorías..."
    >
      <ModalResponsive
        title="Nueva Categoría"
        description="Registre una nueva categoría"
        trigger={
          <Button size="sm">
            <PlusIcon className="size-4" />
            Crear Categoría
          </Button>
        }
      >
        <CreateCategoryForm />
      </ModalResponsive>
    </DataTable>
  );
};
