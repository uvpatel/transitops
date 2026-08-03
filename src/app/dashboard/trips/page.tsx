import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  NavigationIcon,
  PlusIcon,
  SearchIcon,
  ArrowUpRightIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircle2Icon,
} from "lucide-react";

const mockTrips = [
  {
    id: "trip-301",
    tripNumber: "TRIP-8891",
    title: "Chicago to Detroit Cargo Delivery",
    tripType: "DELIVERY",
    priority: "HIGH",
    status: "IN_PROGRESS",
    origin: "Chicago Depot",
    destination: "Detroit Hub",
    scheduledStart: "2026-08-03 08:00",
    driver: "Alexander Wright",
    vehicle: "TRK-9081",
  },
  {
    id: "trip-302",
    tripNumber: "TRIP-8892",
    title: "Houston Medical Supplies Transfer",
    tripType: "TRANSFER",
    priority: "URGENT",
    status: "ASSIGNED",
    origin: "Houston South",
    destination: "Dallas Central",
    scheduledStart: "2026-08-03 11:30",
    driver: "Sarah Jenkins",
    vehicle: "VAN-4022",
  },
  {
    id: "trip-303",
    tripNumber: "TRIP-8893",
    title: "Atlanta Retail Stock Dispatch",
    tripType: "DELIVERY",
    priority: "NORMAL",
    status: "COMPLETED",
    origin: "Atlanta Warehouse",
    destination: "Savannah Port",
    scheduledStart: "2026-08-02 06:00",
    driver: "Marcus Vance",
    vehicle: "TRK-7711",
  },
];

export default function TripsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Trips & Dispatch Logistics</h2>
          <p className="text-sm text-muted-foreground">Manage scheduled trips, cargo manifests, route stops, and status pipelines.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <PlusIcon className="size-4" />
          <span>Create New Trip</span>
        </Button>
      </div>

      {/* Metric Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-blue-600 dark:text-blue-400">Trips In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14 Active</p>
            <p className="text-xs text-muted-foreground mt-0.5">Live telemetry streaming</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">On-Time Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">96.8%</p>
            <p className="text-xs text-muted-foreground mt-0.5">+1.4% vs last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-purple-600 dark:text-purple-400">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18 Completed</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cargo delivered & verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Search trip #, title, origin, destination..." className="pl-8 text-xs h-9" />
        </div>
      </div>

      {/* Trips Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Trip #</TableHead>
              <TableHead className="text-xs font-bold">Title</TableHead>
              <TableHead className="text-xs font-bold">Route</TableHead>
              <TableHead className="text-xs font-bold">Assigned Driver</TableHead>
              <TableHead className="text-xs font-bold">Vehicle</TableHead>
              <TableHead className="text-xs font-bold">Priority</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTrips.map((trip) => (
              <TableRow key={trip.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-semibold text-primary">{trip.tripNumber}</TableCell>
                <TableCell className="font-medium">{trip.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {trip.origin} → {trip.destination}
                </TableCell>
                <TableCell>{trip.driver}</TableCell>
                <TableCell>{trip.vehicle}</TableCell>
                <TableCell>
                  {trip.priority === "URGENT" && (
                    <Badge variant="destructive" className="text-[10px]">
                      URGENT
                    </Badge>
                  )}
                  {trip.priority === "HIGH" && (
                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                      HIGH
                    </Badge>
                  )}
                  {trip.priority === "NORMAL" && (
                    <Badge variant="outline" className="text-muted-foreground">
                      NORMAL
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {trip.status === "IN_PROGRESS" && (
                    <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                      IN PROGRESS
                    </Badge>
                  )}
                  {trip.status === "ASSIGNED" && (
                    <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30">
                      ASSIGNED
                    </Badge>
                  )}
                  {trip.status === "COMPLETED" && (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                      COMPLETED
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button  size="xs" variant="ghost" className="h-7 px-2">
                    <Link href={`/dashboard/trips/${trip.id}`}>
                      View <ArrowUpRightIcon className="size-3 ml-1" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
