"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";

type ModalResponsiveContextProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalResponsiveContext = createContext<ModalResponsiveContextProps>(
  null!,
);

type ModalResponsiveProps = {
  title: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  description?: string;
};

export const ModalResponsive = ({
  title,
  trigger,
  children,
  description,
}: ModalResponsiveProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <ModalResponsiveContext.Provider value={{ open, setOpen }}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </ModalResponsiveContext.Provider>
    );
  }

  return (
    <ModalResponsiveContext.Provider value={{ open, setOpen }}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className="p-4 pt-0">{children}</div>
        </DrawerContent>
      </Drawer>
    </ModalResponsiveContext.Provider>
  );
};

export const useModalReponsive = () => useContext(ModalResponsiveContext);
