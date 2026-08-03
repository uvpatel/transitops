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
      <div className="flex items-center justify-center p-8 text-xs text-muted-foreground gap-3">
        <Loader2Icon className="size-4 animate-spin text-primary" /> Loading telemetry metrics…
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
    <div className="grid grid-cols-1 w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Expenses Card */}
      <Card className="shadow-xs flex flex-col justify-between h-full">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs font-semibold text-muted-foreground">Total Expenses</CardDescription>
          <CardTitle className="text-2xl font-bold tracking-tight tabular-nums mt-0.5">
            {formatCurrency(currentStats.totalExpenses)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-[10px] gap-1 font-medium bg-muted/30">
              <TrendingUpIcon className="size-3 text-emerald-500" />
              {currentStats.activeTrips} active trips
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs border-t bg-muted/30 p-3 mt-auto">
          <div className="flex items-center gap-1.5 font-medium text-foreground w-full truncate">
            <span className="truncate">Operational spend tracked from live DB</span>
            <TrendingUpIcon className="size-3.5 text-emerald-500 shrink-0" />
          </div>
          <div className="text-muted-foreground text-[11px]">
            Fuel spend: {formatCurrency(currentStats.totalFuelCost)}
          </div>
        </CardFooter>
      </Card>

      {/* Vehicles in Service Card */}
      <Card className="shadow-xs flex flex-col justify-between h-full">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs font-semibold text-muted-foreground">Vehicles in Service</CardDescription>
          <CardTitle className="text-2xl font-bold tracking-tight tabular-nums mt-0.5">
            {currentStats.totalVehicles}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-[10px] gap-1 font-medium bg-muted/30">
              <TrendingDownIcon className="size-3 text-blue-500" />
              {currentStats.availableVehicles} available
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs border-t bg-muted/30 p-3 mt-auto">
          <div className="flex items-center gap-1.5 font-medium text-foreground w-full truncate">
            <span className="truncate">{currentStats.vehiclesInTransit} vehicles in transit</span>
            <TrendingDownIcon className="size-3.5 text-blue-500 shrink-0" />
          </div>
          <div className="text-muted-foreground text-[11px]">
            Maintenance open: {currentStats.maintenanceOpen}
          </div>
        </CardFooter>
      </Card>

      {/* Drivers Registered Card */}
      <Card className="shadow-xs flex flex-col justify-between h-full">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs font-semibold text-muted-foreground">Drivers Registered</CardDescription>
          <CardTitle className="text-2xl font-bold tracking-tight tabular-nums mt-0.5">
            {currentStats.totalDrivers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-[10px] gap-1 font-medium bg-muted/30">
              <TrendingUpIcon className="size-3 text-emerald-500" />
              {currentStats.activeUsers} active users
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs border-t bg-muted/30 p-3 mt-auto">
          <div className="flex items-center gap-1.5 font-medium text-foreground w-full truncate">
            <span className="truncate">Fleet coverage is operational</span>
            <TrendingUpIcon className="size-3.5 text-emerald-500 shrink-0" />
          </div>
          <div className="text-muted-foreground text-[11px]">
            Ready for dispatch & assignments
          </div>
        </CardFooter>
      </Card>

      {/* Trips Completed Card */}
      <Card className="shadow-xs flex flex-col justify-between h-full">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs font-semibold text-muted-foreground">Trips Completed</CardDescription>
          <CardTitle className="text-2xl font-bold tracking-tight tabular-nums mt-0.5">
            {currentStats.completedTrips}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-[10px] gap-1 font-medium bg-muted/30">
              <TrendingUpIcon className="size-3 text-emerald-500" />
              {currentStats.activeTrips} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs border-t bg-muted/30 p-3 mt-auto">
          <div className="flex items-center gap-1.5 font-medium text-foreground w-full truncate">
            <span className="truncate">Live telemetry data from API</span>
            <TrendingUpIcon className="size-3.5 text-emerald-500 shrink-0" />
          </div>
          <div className="text-muted-foreground text-[11px]">
            Refreshed dynamically from backend
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
