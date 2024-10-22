import { api } from "@/trpc/server";
import { DataTableUsers } from "./_components/DataTableUsers";

export default async function UsersPage() {
  const users = await api.user.getAll();

  return <DataTableUsers users={users} />;
}
