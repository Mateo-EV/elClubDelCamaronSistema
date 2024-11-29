"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { CreateClientForm } from "./CreateClientForm";
import { clientsTableColums } from "./DataTableClientsColumns";

export const DataTableClients = () => {
  const [clients] = api.customer.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={clients}
      columns={clientsTableColums}
      placeholderSearchInput="Filtrar clientes..."
    >
      <ModalResponsive
        title="Nuevo Cliente"
        description="Registre un nuevo cliente"
        trigger={
          <Button size="sm">
            <PlusIcon className="size-4" />
            Crear Cliente
          </Button>
        }
      >
        <CreateClientForm />
      </ModalResponsive>
    </DataTable>
  );
};
