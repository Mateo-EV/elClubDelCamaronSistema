import { DataTable } from "@/components/datatable/DataTable";
import { api } from "@/trpc/server";
import { usersTableColums } from "./_components/DataTableUsersColumns";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default async function UsersPage() {
  const users = await api.user.getAll();

  return (
    <DataTable
      data={users}
      columns={usersTableColums}
      placeholderSearchInput="Filtrar usuarios..."
    >
      <Button size="sm">
        <PlusIcon className="size-4" />
        Crear Usuario
      </Button>
    </DataTable>
  );
}
