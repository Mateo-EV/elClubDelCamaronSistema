"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { ROLES_DATA } from "@/data/const";
import { type RouterOutputs } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { usersTableColums } from "./DataTableUsersColumns";

type DataTableUsersProps = {
  users: RouterOutputs["user"]["getAll"];
};

export const DataTableUsers = ({ users }: DataTableUsersProps) => {
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
      <Button size="sm">
        <PlusIcon className="size-4" />
        Crear Usuario
      </Button>
    </DataTable>
  );
};
