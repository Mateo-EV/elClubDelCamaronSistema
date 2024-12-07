"use table";

import {
  ModalResponsive,
  useModalReponsive,
} from "@/components/modal/ModalResponsive";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TABLE_STATUS } from "@/data/const";
import { api, type RouterOutputs } from "@/trpc/react";
import { TableStatus } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUpDownIcon, FilterIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TableSelectorProps = {
  tableId?: number;
  setTableId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const TableSelector = ({ setTableId, tableId }: TableSelectorProps) => {
  const { data: tables, isLoading } = api.table.getAll.useQuery();

  if (isLoading || !tables) return <Skeleton className="h-10" />;

  return (
    <TableSelectorHandle
      tables={tables}
      setTableId={setTableId}
      tableId={tableId}
    />
  );
};

type TableFromApi = RouterOutputs["table"]["getAll"][number];

const TableSelectorHandle = ({
  tables,
  setTableId,
  tableId,
}: TableSelectorProps & {
  tables: RouterOutputs["table"]["getAll"];
}) => {
  const [selectedTable, setSelectedTable] = useState<TableFromApi | null>(null);

  useEffect(() => {
    if (tableId) {
      const tableFinded = tables.find((c) => c.id === tableId);
      if (tableFinded) {
        setSelectedTable(tableFinded);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalResponsive
      title="Seleccionar mesas"
      description="Se mostraran todas las mesas con su estado en tiempo real"
      trigger={
        <Button variant="outline" className="w-full justify-between">
          {selectedTable ? "Mesa " + selectedTable.id : "Seleccionar mesa"}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      }
    >
      <TableAdminSelectorContent
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        setTableId={setTableId}
      />
    </ModalResponsive>
  );
};

const TABLE_STATUS_CARD_STYLES = {
  [TableStatus.Available]: "bg-green-100 text-green-800 hover:bg-green-100",
  [TableStatus.Occupied]: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  [TableStatus.Reserved]: "bg-blue-100 text-blue-800 hover:bg-blue-100",
};

const TableAdminSelectorContent = ({
  tables,
  setTableId,
  setSelectedTable,
  selectedTable,
}: Pick<TableSelectorProps, "setTableId"> & {
  tables: RouterOutputs["table"]["getAll"];
  selectedTable: TableFromApi | null;
  setSelectedTable: React.Dispatch<React.SetStateAction<TableFromApi | null>>;
}) => {
  const { setOpen } = useModalReponsive();
  const [statusFilter, setStatusFilter] = useState<TableStatus | "all">("all");
  const [sortTable, setSortTable] = useState<{
    field: "id" | "capacity";
    direction: "asc" | "desc";
  }>({ field: "id", direction: "asc" });
  const [capacityFilter, setCapacityFilter] = useState<[number, number]>([
    0, 10,
  ]);
  const filteredTables = useMemo(() => {
    let result = tables;
    if (statusFilter !== "all") {
      result = result.filter(
        (r) =>
          r.status === statusFilter &&
          r.capacity >= capacityFilter[0] &&
          r.capacity <= capacityFilter[1],
      );
    } else {
      result = result.filter(
        (r) =>
          r.capacity >= capacityFilter[0] && r.capacity <= capacityFilter[1],
      );
    }

    if (sortTable.field === "id") {
      if (sortTable.direction === "asc") return result;
      return result.reverse();
    }

    if (sortTable.direction === "desc") {
      return result.sort((a, b) => b.capacity - a.capacity);
    }

    return result.sort((a, b) => a.capacity - b.capacity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sortTable, capacityFilter]);

  const handleSelect = (table: TableFromApi) => {
    setSelectedTable(table);
    setTableId(table.id);
    setOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-background pb-4 pt-2 md:pt-0">
        <TableSelectFilters
          statusFilter={statusFilter}
          sortTable={sortTable}
          capacityFilter={capacityFilter}
          setStatusFilter={setStatusFilter}
          setSortTable={setSortTable}
          setCapacityFilter={setCapacityFilter}
        />
      </div>
      <ScrollArea className="h-[392px]">
        {filteredTables.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-lg text-muted-foreground">No hay resultados</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTables.map((table) => (
                <motion.div
                  key={table.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.8 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card
                    className={`cursor-pointer hover:bg-accent ${selectedTable?.id === table.id && "border-primary"}`}
                    onClick={() => handleSelect(table)}
                  >
                    <CardHeader className="items-center space-y-3">
                      <span className="text-4xl">
                        {table.status === TableStatus.Available
                          ? "✔️"
                          : table.status === TableStatus.Occupied
                            ? "🍽️"
                            : "📅"}
                      </span>
                      <CardTitle className="flex items-center justify-between">
                        Mesa {table.id}
                      </CardTitle>
                      <Badge className={TABLE_STATUS_CARD_STYLES[table.status]}>
                        {TABLE_STATUS[table.status]}
                      </Badge>
                      <CardDescription>
                        Capacidad: {table.capacity}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </>
  );
};

type TableFiltersProps = {
  statusFilter: TableStatus | "all";
  sortTable: { field: "id" | "capacity"; direction: "asc" | "desc" };
  setStatusFilter: React.Dispatch<React.SetStateAction<TableStatus | "all">>;
  setSortTable: React.Dispatch<
    React.SetStateAction<{
      field: "id" | "capacity";
      direction: "asc" | "desc";
    }>
  >;
  capacityFilter: [number, number];
  setCapacityFilter: React.Dispatch<React.SetStateAction<[number, number]>>;
};

const TableSelectFilters = ({
  statusFilter,
  sortTable,
  capacityFilter,
  setStatusFilter,
  setSortTable,
  setCapacityFilter,
}: TableFiltersProps) => {
  return (
    <div className="flex items-center justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <FilterIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filtros</h4>
              <p className="text-sm text-muted-foreground">
                Establece los filtros de búsqueda
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Estado</Label>
                <Select
                  onValueChange={(val) =>
                    setStatusFilter(val as typeof statusFilter)
                  }
                  value={statusFilter}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {Object.entries(TABLE_STATUS).map(([value, label]) => (
                      <SelectItem value={value} key={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Capacidad</Label>
                <Input
                  type="number"
                  value={capacityFilter[0]}
                  onChange={(e) =>
                    setCapacityFilter((prev) => [
                      Number(e.target.value),
                      prev[1],
                    ])
                  }
                />
                <Input
                  type="number"
                  value={capacityFilter[1]}
                  onChange={(e) =>
                    setCapacityFilter((prev) => [
                      prev[0],
                      Number(e.target.value),
                    ])
                  }
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-4">
        <Label className="hidden whitespace-nowrap sm:inline">
          Ordernar Por
        </Label>
        <Select
          onValueChange={(val) =>
            setSortTable((prev) => ({
              field: val as (typeof sortTable)["field"],
              direction: prev.direction,
            }))
          }
          value={sortTable.field}
        >
          <SelectTrigger className="gap-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">Número</SelectItem>
            <SelectItem value="capacity">Capacidad</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(val) =>
            setSortTable((prev) => ({
              field: prev.field,
              direction: val as (typeof sortTable)["direction"],
            }))
          }
          value={sortTable.direction}
        >
          <SelectTrigger className="gap-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascendente</SelectItem>
            <SelectItem value="desc">Descendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
