/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { OrderCard } from "./OrderCard";

export const OrdersList = () => {
  const [orders] = api.waiter.getMyOrdersFromToday.useSuspenseQuery(undefined, {
    refetchInterval: 2000,
  });

  if (orders.length === 0) {
    return (
      <h3 className="text-center text-lg text-muted-foreground">
        No tienes pedidos el dia de hoy
      </h3>
    );
  }

  return <OrdersSortedContent orders={orders} />;
};

function OrdersSortedContent({
  orders,
}: {
  orders: RouterOutputs["waiter"]["getMyOrdersFromToday"];
}) {
  const ordersSorted = useMemo(() => {
    return [...orders].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }, [orders]);

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {ordersSorted.map((order) => (
          <motion.div
            key={order.id}
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
            <OrderCard order={order} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
