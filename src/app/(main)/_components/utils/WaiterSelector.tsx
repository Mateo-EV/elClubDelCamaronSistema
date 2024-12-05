"use waiter";

import {
  ModalResponsive,
  useModalReponsive,
} from "@/components/modal/ModalResponsive";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api, type RouterOutputs } from "@/trpc/react";
import {
  ChevronsUpDownIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type WaiterSelectorProps = {
  waiterId?: number;
  setWaiterId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const WaiterSelector = ({
  setWaiterId,
  waiterId,
}: WaiterSelectorProps) => {
  const { data: waiters, isLoading } = api.user.getWaiters.useQuery();

  if (isLoading || !waiters) return <Skeleton className="h-10" />;

  return (
    <WaiterSelectorHandle
      waiters={waiters}
      setWaiterId={setWaiterId}
      waiterId={waiterId}
    />
  );
};

type WaiterFromApi = RouterOutputs["user"]["getWaiters"][number];

const WaiterSelectorHandle = ({
  waiters,
  setWaiterId,
  waiterId,
}: WaiterSelectorProps & {
  waiters: RouterOutputs["user"]["getWaiters"];
}) => {
  const [selectedWaiter, setSelectedWaiter] = useState<WaiterFromApi | null>(
    null,
  );

  useEffect(() => {
    if (waiterId) {
      const customerFinded = waiters.find((c) => c.id === waiterId);
      if (customerFinded) {
        setSelectedWaiter(customerFinded);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalResponsive
      title="Seleccionar mozos"
      description="Se mostraran 5 mozos por página"
      trigger={
        <Button variant="outline" className="w-full justify-between">
          {selectedWaiter ? (
            <div className="flex items-center">
              <Avatar className="mr-2 h-6 w-6">
                <AvatarFallback>
                  {selectedWaiter.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {selectedWaiter.firstName + " " + selectedWaiter.lastName}
            </div>
          ) : (
            "Seleccionar mozos"
          )}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      }
    >
      <WaiterSelectorContent
        waiters={waiters}
        selectedWaiter={selectedWaiter}
        setSelectedWaiter={setSelectedWaiter}
        setWaiterId={setWaiterId}
      />
    </ModalResponsive>
  );
};

const WaiterSelectorContent = ({
  waiters,
  setWaiterId,
  setSelectedWaiter,
  selectedWaiter,
}: Pick<WaiterSelectorProps, "setWaiterId"> & {
  waiters: RouterOutputs["user"]["getWaiters"];
  selectedWaiter: WaiterFromApi | null;
  setSelectedWaiter: React.Dispatch<React.SetStateAction<WaiterFromApi | null>>;
}) => {
  const { setOpen } = useModalReponsive();
  const [search, setSearch] = useState("");
  const filteredWaiters = useMemo(() => {
    let result = waiters;
    if (search) {
      const searchLower = search.toLowerCase();
      result = waiters.filter(
        (waiter) =>
          waiter.firstName.toLowerCase().includes(searchLower) ||
          waiter.lastName.toLowerCase().includes(searchLower) ||
          waiter.email.toLowerCase().includes(searchLower),
      );
    }
    if (selectedWaiter && !result.some((c) => c.id === selectedWaiter.id)) {
      result = [selectedWaiter, ...result];
    }
    return result.slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedWaiter]);

  const handleSelect = (customer: WaiterFromApi) => {
    setSelectedWaiter(customer);
    setWaiterId(customer.id);
    setOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-background pb-4 pt-2 md:pt-0">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar mozos..."
            onChange={(event) => setSearch(event.target.value)}
            value={search}
            className="pl-8"
          />
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
        {filteredWaiters.length === 0 ? (
          <p className="col-span-full p-2 text-center text-muted-foreground">
            No se encontraron mozos.
          </p>
        ) : (
          filteredWaiters.map((waiter) => (
            <div
              key={waiter.id}
              className={cn(
                "flex cursor-pointer flex-col rounded-lg p-4 transition-colors duration-200",
                selectedWaiter?.id === waiter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={() => handleSelect(waiter)}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="mr-3 h-10 w-10">
                    <AvatarFallback
                      className={cn(
                        waiter.id === selectedWaiter?.id && "text-primary",
                      )}
                    >
                      {waiter.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="w-7/12 truncate text-lg font-medium">
                    {waiter.firstName + " " + waiter.lastName}
                  </span>
                </div>
                <Badge
                  variant={
                    waiter.activeOrdersCount! > 3 ? "destructive" : "secondary"
                  }
                >
                  {waiter.activeOrdersCount}
                </Badge>
              </div>
              <div className="grid grid-cols-[16px_1fr] gap-2 text-sm">
                <MailIcon className="h-4 w-4" />
                <span className="truncate">{waiter.email}</span>
                <PhoneIcon className="h-4 w-4" />
                <span>{waiter.phone}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
