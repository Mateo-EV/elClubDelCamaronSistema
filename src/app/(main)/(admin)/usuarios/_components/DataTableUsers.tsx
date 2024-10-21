"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { Users } from "lucide-react";

type DataTableUsersProps = {
  users;
};

export const DataTableUsers = ({ users }: DataTableUsersProps) => {
  return <DataTable data={Users} />;
};
