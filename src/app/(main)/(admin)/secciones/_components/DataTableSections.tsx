"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { CreateSectionForm } from "./CreateSectionForm";
import { sectionsTableColums } from "./DataTableSectionsColumns";

export const DataTableSections = () => {
  const [sections] = api.section.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={sections}
      columns={sectionsTableColums}
      placeholderSearchInput="Filtrar secciones..."
    >
      <ModalResponsive
        title="Nueva Sección"
        description="Registre una nueva sección"
        trigger={
          <Button size="sm">
            <PlusIcon className="size-4" />
            Crear Sección
          </Button>
        }
      >
        <CreateSectionForm />
      </ModalResponsive>
    </DataTable>
  );
};
