import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { db } from "@/server/db";
import { Suspense } from "react";
import { CalendarDateRangePicker } from "./_components/DateTimePicker";
import { type MonthlyRevenue, Overview } from "./_components/Overview";
import { RecentOrders } from "./_components/RecentOrders";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}

async function Dashboard() {
  const [
    {
      _sum: { total: totalRevenue },
    },
    activeOrders,
    availableTables,
    activeReservations,
    monthlyRevenue,
    recentOrders,
  ] = await db.$transaction([
    db.order.aggregate({
      _sum: { total: true },
      where: {
        status: "Completed",
      },
    }),
    db.order.count({
      where: {
        status: "Completed",
      },
    }),
    db.table.count({
      where: { status: "Available" },
    }),
    db.reservation.count({
      where: {
        status: {
          in: ["Confirmed", "Pending"], // Estados activos
        },
      },
    }),
    db.$queryRaw<MonthlyRevenue[]>`
    SELECT 
      DATE_FORMAT(createdAt, '%b') AS month, -- Obtiene el nombre del mes (Jan, Feb, etc.)
      SUM(total) AS revenue
    FROM \`Order\`
    WHERE status = 'Completado'
    GROUP BY DATE_FORMAT(createdAt, '%Y-%m') -- Agrupa por año y mes
    ORDER BY DATE_FORMAT(createdAt, '%Y-%m');
  `,
    db.order.findMany({
      take: 5,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        total: true,
        tableId: true,
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue ?? 0)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Completados
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeOrders}</div>
            {/* <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mesas Disponibles
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTables}</div>
            {/* <p className="text-xs text-muted-foreground">+19% from last hour</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reservaciones Activas
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReservations}</div>
            {/* <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p> */}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visión General</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview monthlyRevenue={monthlyRevenue} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders recentOrders={recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
