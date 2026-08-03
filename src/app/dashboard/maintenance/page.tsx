import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WrenchIcon, PlusIcon, CalendarIcon, AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";

const mockWorkOrders = [
  {
    id: "wo-401",
    workOrderNumber: "WO-9081",
    vehicle: "TRK-7711 (Scania R500)",
    type: "ENGINE_SERVICE",
    priority: "HIGH",
    status: "IN_PROGRESS",
    provider: "Midwest Truck Service Center",
    cost: "$1,250.00",
    scheduledAt: "2026-08-02",
  },
  {
    id: "wo-402",
    workOrderNumber: "WO-9082",
    vehicle: "TRK-104 (Volvo FH16)",
    type: "OIL_CHANGE",
    priority: "NORMAL",
    status: "SCHEDULED",
    provider: "Express Auto Fleet Care",
    cost: "$380.00",
    scheduledAt: "2026-08-05",
  },
];

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Maintenance & Work Orders</h2>
          <p className="text-sm text-muted-foreground">Schedule preventative service, track repair work orders, and manage service providers.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <PlusIcon className="size-4" />
          <span>Create Work Order</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400">Open Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5 Pending</p>
            <p className="text-xs text-muted-foreground mt-0.5">3 In-Progress, 2 Scheduled</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Services Completed (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14 Completed</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total spent: $8,420.00</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-rose-500/5 border-rose-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-rose-600 dark:text-rose-400">Overdue Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-rose-600">2 Overdue</p>
            <p className="text-xs text-muted-foreground mt-0.5">Kilometer interval exceeded</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">WO #</TableHead>
              <TableHead className="text-xs font-bold">Vehicle</TableHead>
              <TableHead className="text-xs font-bold">Service Type</TableHead>
              <TableHead className="text-xs font-bold">Provider</TableHead>
              <TableHead className="text-xs font-bold">Est. Cost</TableHead>
              <TableHead className="text-xs font-bold">Scheduled</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWorkOrders.map((wo) => (
              <TableRow key={wo.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-semibold text-primary">{wo.workOrderNumber}</TableCell>
                <TableCell className="font-medium">{wo.vehicle}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {wo.type}
                  </Badge>
                </TableCell>
                <TableCell>{wo.provider}</TableCell>
                <TableCell className="font-semibold">{wo.cost}</TableCell>
                <TableCell>{wo.scheduledAt}</TableCell>
                <TableCell>
                  {wo.status === "IN_PROGRESS" && (
                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                      IN PROGRESS
                    </Badge>
                  )}
                  {wo.status === "SCHEDULED" && (
                    <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                      SCHEDULED
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
