import * as React from "react";
import Link from "next/link";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TruckIcon,
  NavigationIcon,
  UserPlusIcon,
  ReceiptIcon,
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  WrenchIcon,
  FuelIcon,

} from "lucide-react"


export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-5 border border-primary/10">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Fleet Operations Center</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time telemetry, trip status, driver safety, and maintenance compliance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
  <Button  size="sm" className="gap-2">
    <Link href="/dashboard/trips" className="flex items-center gap-2">
      <NavigationIcon className="h-4 w-4" />
      <span>Create Trip</span>
    </Link>
  </Button>

  <Button size="sm" variant="outline" className="gap-2">
    <Link href="/dashboard/fleet" className="flex items-center gap-2">
      <TruckIcon className="h-4 w-4 text-emerald-500" />
      <span>Add Vehicle</span>
    </Link>
  </Button>

  <Button size="sm" variant="outline" className="gap-2">
    <Link href="/dashboard/drivers" className="flex items-center gap-2">
      <UserPlusIcon className="h-4 w-4 text-purple-500" />
      <span>Register Driver</span>
    </Link>
  </Button>

 <Button size="sm" variant="outline">
  <Link
    href="/dashboard/expenses"
    className="flex items-center gap-2"
  >
    <ReceiptIcon className="h-4 w-4 text-amber-500" />
    <span>File Expense</span>
  </Link>
</Button>
</div>
      </div>

      {/* KPI Cards */}
      <SectionCards />

      {/* Main Grid: Charts & Compliance Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Fleet Utilization & Telematics Chart (2 cols) */}
        <div className="lg:col-span-2">
          <ChartAreaInteractive />
        </div>

        {/* Operational Alerts & Upcoming Maintenance (1 col) */}
        <div className="space-y-4">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Critical Alerts & Maintenance</CardTitle>
                <Badge variant="destructive" className="text-[10px] font-bold">
                  2 Overdue
                </Badge>
              </div>
              <CardDescription className="text-xs">Immediate compliance & service actions required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400">
                <AlertTriangleIcon className="size-4 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Driver License Expiring</p>
                  <p className="text-[11px] opacity-90">John Doe (DL-98214) expires in 3 days.</p>
                </div>
                <Button  size="xs" variant="ghost" className="h-7 px-2">
                  <Link href="/dashboard/compliance">
                    View <ArrowUpRightIcon className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                <WrenchIcon className="size-4 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Oil Change Overdue</p>
                  <p className="text-[11px] opacity-90">Vehicle #TRK-104 exceeded limit by 420 km.</p>
                </div>
                <Button size="xs" variant="ghost" className="h-7 px-2">
                  <Link href="/dashboard/maintenance">
                    Schedule <ArrowUpRightIcon className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
                <FuelIcon className="size-4 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Fuel Efficiency Anomaly</p>
                  <p className="text-[11px] opacity-90">Van #VAN-089 reported -18% efficiency drop.</p>
                </div>
                <Button size="xs" variant="ghost" className="h-7 px-2">
                  <Link href="/dashboard/fuel">
                    Audit <ArrowUpRightIcon className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Operational Quick Status */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Active Fleet Health</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                  <CheckCircle2Icon className="size-4" />
                  <span>Available</span>
                </div>
                <p className="text-xl font-bold">28 Vehicles</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ready for dispatch</p>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  <ClockIcon className="size-4" />
                  <span>In Transit</span>
                </div>
                <p className="text-xl font-bold">14 Active</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">On active routes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Trips Telematics Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Active Trips & Logistics</h3>
            <p className="text-xs text-muted-foreground">Live telemetry feeds and delivery stop progressions</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1 text-xs">
            <Link href="/dashboard/trips">
              View All Trips <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </Button>
        </div>
        <DataTable />
      </div>
    </div>
  );
}
