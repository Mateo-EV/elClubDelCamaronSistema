"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { ModalResponsive } from "@/components/modal/ModalResponsive";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { CreateReservationForm } from "./CreateReservationForm";
import { reservationsTableColums } from "./DataTableReservationsColumns";

export const DataTableReservations = () => {
  const [reservations] = api.reservation.getAll.useSuspenseQuery();

  return (
    <DataTable
      data={reservations}
      columns={reservationsTableColums}
      placeholderSearchInput="Filtrar reservas..."
    >
      <ModalResponsive
        title="Nueva Reservación"
        description="Registre una nueva reservación"
        trigger={
          <Button size="sm">
            <PlusIcon className="size-4" />
            Crear Reservación
          </Button>
        }
      >
        <CreateReservationForm />
      </ModalResponsive>
    </DataTable>
  );
};
