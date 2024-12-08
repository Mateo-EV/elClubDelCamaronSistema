"use client";

import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  type PopoverContentProps,
  type PopoverProps,
} from "@radix-ui/react-popover";
import { createContext, useContext, useEffect, useState } from "react";
import { Button, type ButtonProps } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type ComboboxContextProps = {
  chosen: { label: React.ReactNode | null; value: string } | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChosen: React.Dispatch<
    React.SetStateAction<ComboboxContextProps["chosen"]>
  >;
};

const ComboboxContext = createContext<ComboboxContextProps>({
  open: false,
  chosen: null,
} as ComboboxContextProps);

const useCombobox = () => useContext(ComboboxContext);

const Combobox = ({
  onValueChange,
  defaultValue,
  ...props
}: Omit<PopoverProps, "open" | "onOpenChange" | "defaultOpen"> & {
  onValueChange: (value: string | null) => void;
  defaultValue?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<ComboboxContextProps["chosen"]>(
    defaultValue ? { label: null, value: defaultValue } : null,
  );

  useEffect(() => {
    onValueChange(chosen?.value ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  return (
    <ComboboxContext.Provider value={{ open, chosen, setOpen, setChosen }}>
      <Popover open={open} onOpenChange={setOpen} {...props} />
    </ComboboxContext.Provider>
  );
};

const ComboboxTrigger = ({
  className,
  ...props
}: Omit<ButtonProps, "variant" | "role">) => (
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      className={cn("flex w-full justify-between", className)}
      {...props}
    />
  </PopoverTrigger>
);

const ComboboxValue = ({ placeholder }: { placeholder?: string }) => {
  const { chosen } = useCombobox();

  return (
    <>
      {chosen ? chosen.label : <span>{placeholder}</span>}{" "}
      <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
    </>
  );
};

const ComboboxContent = ({
  className,
  children,
  searchPlaceholder,
  emptyMessage,
  ...props
}: PopoverContentProps & {
  searchPlaceholder: string;
  emptyMessage: string;
}) => {
  return (
    <PopoverContent className={cn("p-0", className)} {...props}>
      <Command>
        <CommandInput className="h-9" placeholder={searchPlaceholder} />
        <CommandList>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>{children}</CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
};

const ComboboxItem = ({
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, "onSelect">) => {
  const { setChosen, chosen } = useCombobox();

  const isThisItemChosen = chosen?.value === props.value;

  useEffect(() => {
    if (!chosen) return;
    if (chosen.label) return;

    if (isThisItemChosen) {
      setChosen((prev) => ({ value: prev!.value, label: children }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CommandItem
      {...props}
      onSelect={(currentValue) => {
        setChosen(
          isThisItemChosen ? null : { label: children, value: currentValue },
        );
      }}
    >
      {children}
      <CheckIcon
        className={cn(
          "ml-auto size-4",
          isThisItemChosen ? "opacity-100" : "opacity-0",
        )}
      />
    </CommandItem>
  );
};

export {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
};
