"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { ROLES_DATA } from "@/data/const";
import { PlusIcon } from "lucide-react";
import { usersTableColums } from "./DataTableUsersColumns";
import { api } from "@/trpc/react";
import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { CreateUserForm } from "./CreateUserForm";

export const DataTableUsers = () => {
  const [users] = api.user.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={users}
      columns={usersTableColums}
      placeholderSearchInput="Filtrar usuarios..."
      selectFilters={[
        {
          column: "Rol",
          options: Object.entries(ROLES_DATA).map(
            ([value, { name, icon }]) => ({ label: name, value, icon }),
          ),
        },
      ]}
    >
      <ModalResponsive
        title="Nuevo Usuario"
        description="Agrega un nuevo usuario para que pueda ingresar al sistema"
        trigger={
          <Button size="sm">
            <PlusIcon className="size-4" />
            Crear Usuario
          </Button>
        }
      >
        <CreateUserForm />
      </ModalResponsive>
    </DataTable>
  );
};
