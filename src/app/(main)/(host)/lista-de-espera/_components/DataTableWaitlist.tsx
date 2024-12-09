"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { CreateWaitlistForm } from "./CreateWaitlistForm";
import { waitlistTableColums } from "./DataTableWailistColumns";

export const DataTableWaitlist = () => {
  const [waitlist] = api.waitlist.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={waitlist}
      columns={waitlistTableColums}
      placeholderSearchInput="Filtrar en lista de espera..."
    >
      <ModalResponsive
        title="Nueva Asignación"
        description="Asigne un nuevo cliente a la lista de espera"
        trigger={
          <Button size="sm">
            <PlusIcon className="size-4" />
            Agregar Cliente
          </Button>
        }
      >
        <CreateWaitlistForm />
      </ModalResponsive>
    </DataTable>
  );
};
