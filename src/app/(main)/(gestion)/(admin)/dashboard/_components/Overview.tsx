"use client";

import { ChartContainer } from "@/components/ui/chart";
import { formatPrice } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

const months = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
  { month: "Jul", revenue: 0 },
  { month: "Aug", revenue: 0 },
  { month: "Sep", revenue: 0 },
  { month: "Oct", revenue: 0 },
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 0 },
];

export function Overview({
  monthlyRevenue,
}: {
  monthlyRevenue: MonthlyRevenue[];
}) {
  const data = months.map((m) => {
    const found = monthlyRevenue.find((r) => r.month === m.month);
    return found ?? m;
  });

  return (
    <ChartContainer config={{}}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatPrice(value as number)}
        />
        <Bar
          dataKey="revenue"
          fill="hsla(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
