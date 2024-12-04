"use client";

import {
  ModalResponsive,
  useModalReponsive,
} from "@/components/modal/ModalResponsive";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ClientSelectorProps = {
  clientId?: number;
  setClientId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const ClientSelector = ({
  setClientId,
  clientId,
}: ClientSelectorProps) => {
  const { data: customers, isLoading } = api.customer.getAll.useQuery();

  if (isLoading || !customers) return <Skeleton className="h-10" />;

  return (
    <ClientSelectorHandle
      customers={customers}
      setClientId={setClientId}
      clientId={clientId}
    />
  );
};

type CustomerFromApi = RouterOutputs["customer"]["getAll"][number];

const ClientSelectorHandle = ({
  customers,
  setClientId,
  clientId,
}: ClientSelectorProps & {
  customers: RouterOutputs["customer"]["getAll"];
}) => {
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerFromApi | null>(null);

  useEffect(() => {
    if (clientId) {
      const customerFinded = customers.find((c) => c.id === clientId);
      if (customerFinded) {
        setSelectedCustomer(customerFinded);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalResponsive
      title="Seleccionar clientes"
      description="Se mostraran 5 clientes por página"
      trigger={
        <Button variant="outline" className="w-full justify-between">
          {selectedCustomer ? (
            <div className="flex items-center">
              <Avatar className="mr-2 h-6 w-6">
                <AvatarFallback>
                  {selectedCustomer.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {selectedCustomer.firstName + " " + selectedCustomer.lastName}
            </div>
          ) : (
            "Seleccionar cliente"
          )}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      }
    >
      <CustomerSelectorContent
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        setClientId={setClientId}
      />
    </ModalResponsive>
  );
};

const CustomerSelectorContent = ({
  customers,
  setClientId,
  setSelectedCustomer,
  selectedCustomer,
}: Pick<ClientSelectorProps, "setClientId"> & {
  customers: RouterOutputs["customer"]["getAll"];
  selectedCustomer: CustomerFromApi | null;
  setSelectedCustomer: React.Dispatch<
    React.SetStateAction<CustomerFromApi | null>
  >;
}) => {
  const { setOpen } = useModalReponsive();
  const [search, setSearch] = useState("");
  const filteredCustomers = useMemo(() => {
    let result = customers;
    if (search) {
      const searchLower = search.toLowerCase();
      result = customers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchLower) ||
          customer.lastName.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.phone.includes(search),
      );
    }
    if (selectedCustomer && !result.some((c) => c.id === selectedCustomer.id)) {
      result = [selectedCustomer, ...result];
    }
    return result.slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCustomer]);

  const handleSelect = (customer: CustomerFromApi) => {
    setSelectedCustomer(customer);
    setClientId(customer.id);
    setOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-background pb-4 pt-2 md:pt-0">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            onChange={(event) => setSearch(event.target.value)}
            value={search}
            className="pl-8"
          />
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
        {filteredCustomers.length === 0 ? (
          <p className="col-span-full p-2 text-center text-muted-foreground">
            No se encontraron clientes.
          </p>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className={cn(
                "flex cursor-pointer flex-col rounded-lg p-4 transition-colors duration-200",
                selectedCustomer?.id === customer.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={() => handleSelect(customer)}
            >
              <div className="mb-2 flex items-center">
                <Avatar className="mr-3 h-10 w-10">
                  <AvatarFallback
                    className={cn(
                      customer.id === selectedCustomer?.id && "text-primary",
                    )}
                  >
                    {customer.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-lg font-medium">
                  {customer.firstName + " " + customer.lastName}
                </span>
              </div>
              <div className="grid grid-cols-[16px_1fr] gap-2 text-sm">
                <MailIcon className="h-4 w-4" />
                <span className="truncate">{customer.email}</span>
                <PhoneIcon className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
