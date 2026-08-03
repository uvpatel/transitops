"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, Loader2Icon } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

interface StatsData {
  totalExpenses: number;
  totalFuelCost: number;
  activeTrips: number;
  completedTrips: number;
  totalVehicles: number;
  availableVehicles: number;
  vehiclesInTransit: number;
  maintenanceOpen: number;
  totalDrivers: number;
  activeUsers: number;
}

export function SectionCards() {
  const [stats, setStats] = React.useState<StatsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchAllStats() {
      try {
        const [vehiclesRes, tripsRes, driversRes, maintRes, expRes, fuelRes, usersRes] = await Promise.all([
          fetch("/api/vehicle").then((r) => r.json()).catch(() => ({ vehicles: [] })),
          fetch("/api/trips").then((r) => r.json()).catch(() => ({ trips: [] })),
          fetch("/api/drivers").then((r) => r.json()).catch(() => ({ drivers: [] })),
          fetch("/api/maintenance").then((r) => r.json()).catch(() => ({ workOrders: [] })),
          fetch("/api/expenses").then((r) => r.json()).catch(() => ({ expenses: [] })),
          fetch("/api/fuel-logs").then((r) => r.json()).catch(() => ({ fuelLogs: [] })),
          fetch("/api/users").then((r) => r.json()).catch(() => ({ users: [] })),
        ]);

        const vehiclesList = vehiclesRes.vehicles || [];
        const tripsList = tripsRes.trips || [];
        const driversList = driversRes.drivers || [];
        const workOrdersList = maintRes.workOrders || [];
        const expensesList = expRes.expenses || [];
        const fuelLogsList = fuelRes.fuelLogs || [];
        const usersList = usersRes.users || [];

        const available = vehiclesList.filter((v: any) => v.status === "AVAILABLE").length;
        const inTransit = vehiclesList.filter((v: any) => v.status === "IN_TRANSIT").length;
        const maintOpen = workOrdersList.filter((w: any) => w.status !== "COMPLETED" && w.status !== "CANCELLED").length;
        const activeT = tripsList.filter((t: any) => t.status === "ASSIGNED" || t.status === "IN_PROGRESS" || t.status === "READY").length;
        const completedT = tripsList.filter((t: any) => t.status === "COMPLETED").length;
        const expTotal = expensesList.reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0);
        const fuelTotal = fuelLogsList.reduce((acc: number, f: any) => acc + (Number(f.totalAmount) || 0), 0);
        const activeU = usersList.filter((u: any) => u.status === "ACTIVE").length;

        if (isMounted) {
          setStats({
            totalExpenses: expTotal,
            totalFuelCost: fuelTotal,
            activeTrips: activeT,
            completedTrips: completedT,
            totalVehicles: vehiclesList.length,
            availableVehicles: available,
            vehiclesInTransit: inTransit,
            maintenanceOpen: maintOpen,
            totalDrivers: driversList.length,
            activeUsers: activeU,
          });
        }
      } catch {
        if (isMounted) {
          setStats({
            totalExpenses: 0,
            totalFuelCost: 0,
            activeTrips: 0,
            completedTrips: 0,
            totalVehicles: 0,
            availableVehicles: 0,
            vehiclesInTransit: 0,
            maintenanceOpen: 0,
            totalDrivers: 0,
            activeUsers: 0,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAllStats();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-muted-foreground gap-4">
        <Loader2Icon className="size-4 animate-spin" /> Loading dashboard metrics…
      </div>
    );
  }

  const currentStats = stats || {
    totalExpenses: 0,
    totalFuelCost: 0,
    activeTrips: 0,
    completedTrips: 0,
    totalVehicles: 0,
    availableVehicles: 0,
    vehiclesInTransit: 0,
    maintenanceOpen: 0,
    totalDrivers: 0,
    activeUsers: 0,
  };

  return (
    <div className="grid grid-cols-1 w-full gap-8 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card shadow-xs">
        <CardHeader>
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(currentStats.totalExpenses)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {currentStats.activeTrips} active trips
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Operational spend tracked from live DB
            <TrendingUpIcon className="size-4 text-emerald-500" />
          </div>
          <div className="text-muted-foreground">Fuel spend: {formatCurrency(currentStats.totalFuelCost)}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card shadow-xs">
        <CardHeader>
          <CardDescription>Vehicles in Service</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {currentStats.totalVehicles}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon />
              {currentStats.availableVehicles} available
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {currentStats.vehiclesInTransit} vehicles in transit
            <TrendingDownIcon className="size-4 text-blue-500" />
          </div>
          <div className="text-muted-foreground">Maintenance open: {currentStats.maintenanceOpen}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card shadow-xs">
        <CardHeader>
          <CardDescription>Drivers Registered</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {currentStats.totalDrivers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {currentStats.activeUsers} active users
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Fleet coverage is operational
            <TrendingUpIcon className="size-4 text-emerald-500" />
          </div>
          <div className="text-muted-foreground">Ready for dispatch & assignments</div>
        </CardFooter>
      </Card>

      <Card className="@container/card shadow-xs">
        <CardHeader>
          <CardDescription>Trips Completed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {currentStats.completedTrips}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {currentStats.activeTrips} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Live telemetry data from API
            <TrendingUpIcon className="size-4 text-emerald-500" />
          </div>
          <div className="text-muted-foreground">Refreshed dynamically from backend</div>
        </CardFooter>
      </Card>
    </div>
  );
}
