import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { OrderStatus, ReservationStatus } from "@prisma/client";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        [OrderStatus.Pending]:
          "text-yellow-500 bg-yellow-500/40 hover:bg-yellow-500/20 border-transparent",
        [OrderStatus.InProcess]:
          "text-blue-500 bg-blue-500/40 hover:bg-blue-500/20 border-transparent",
        [OrderStatus.Canceled]:
          "text-red-500 bg-red-500/40 hover:bg-red-500/20 border-transparent",
        [OrderStatus.Completed]:
          "text-green-500 bg-green-500/40 hover:bg-green-500/20 border-transparent",
        [ReservationStatus.Confirmed]:
          "text-green-500 bg-green-500/40 hover:bg-green-500/20 border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
