"use client";

import { type RouterOutputs } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { TableCard } from "./TableCard";

const tableVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

type TableGridProps = {
  tables: RouterOutputs["table"]["getAll"];
};

export const TableGrid = ({ tables }: TableGridProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
      <AnimatePresence mode="wait">
        {tables.map((table) => (
          <motion.div
            key={table.id}
            layout
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TableCard table={table} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
