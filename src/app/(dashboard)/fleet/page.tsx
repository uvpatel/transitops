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
  TruckIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpRightIcon,
  WrenchIcon,
  FuelIcon,
  CheckCircle2Icon,
  ClockIcon,
} from "lucide-react";

const mockVehicles = [
  {
    id: "v-101",
    registrationNumber: "TRK-9081",
    makeModel: "Volvo FH16",
    vehicleType: "TRUCK",
    capacityKg: "25,000",
    odometerKm: "142,500",
    fuelType: "DIESEL",
    status: "AVAILABLE",
  },
  {
    id: "v-102",
    registrationNumber: "VAN-4022",
    makeModel: "Mercedes Sprinter",
    vehicleType: "VAN",
    capacityKg: "3,500",
    odometerKm: "68,200",
    fuelType: "DIESEL",
    status: "IN_TRANSIT",
  },
  {
    id: "v-103",
    registrationNumber: "TRK-7711",
    makeModel: "Scania R500",
    vehicleType: "TRUCK",
    capacityKg: "28,000",
    odometerKm: "210,400",
    fuelType: "DIESEL",
    status: "MAINTENANCE",
  },
  {
    id: "v-104",
    registrationNumber: "EV-1090",
    makeModel: "Tesla Semi",
    vehicleType: "TRUCK",
    capacityKg: "20,000",
    odometerKm: "34,100",
    fuelType: "ELECTRIC",
    status: "AVAILABLE",
  },
  {
    id: "v-105",
    registrationNumber: "VAN-8831",
    makeModel: "Ford Transit",
    vehicleType: "VAN",
    capacityKg: "2,800",
    odometerKm: "89,000",
    fuelType: "HYBRID",
    status: "IN_TRANSIT",
  },
];

export default function FleetPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Fleet Vehicles</h2>
          <p className="text-sm text-muted-foreground">Manage your organization's vehicles, capacity, insurance, and service history.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <PlusIcon className="size-4" />
          <span>Add New Vehicle</span>
        </Button>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2Icon className="size-4" /> Available Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">28</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ready for trip dispatch</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <ClockIcon className="size-4" /> In Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14</p>
            <p className="text-xs text-muted-foreground mt-0.5">Currently on active routes</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <WrenchIcon className="size-4" /> In Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground mt-0.5">Service & work orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-card p-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Search registration number, make, model..." className="pl-8 text-xs h-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1 text-xs">
            <FilterIcon className="size-3.5" />
            <span>Filter Type</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1 text-xs">
            <span>Status: All</span>
          </Button>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Registration</TableHead>
              <TableHead className="text-xs font-bold">Make & Model</TableHead>
              <TableHead className="text-xs font-bold">Type</TableHead>
              <TableHead className="text-xs font-bold">Capacity (kg)</TableHead>
              <TableHead className="text-xs font-bold">Odometer (km)</TableHead>
              <TableHead className="text-xs font-bold">Fuel Type</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVehicles.map((vehicle) => (
              <TableRow key={vehicle.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-semibold text-primary">{vehicle.registrationNumber}</TableCell>
                <TableCell>{vehicle.makeModel}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {vehicle.vehicleType}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.capacityKg} kg</TableCell>
                <TableCell>{vehicle.odometerKm} km</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 font-medium">
                    <FuelIcon className="size-3 text-muted-foreground" /> {vehicle.fuelType}
                  </span>
                </TableCell>
                <TableCell>
                  {vehicle.status === "AVAILABLE" && (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30">
                      AVAILABLE
                    </Badge>
                  )}
                  {vehicle.status === "IN_TRANSIT" && (
                    <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/30">
                      IN TRANSIT
                    </Badge>
                  )}
                  {vehicle.status === "MAINTENANCE" && (
                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/30">
                      MAINTENANCE
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="xs" variant="ghost" className="h-7 px-2">
                    <Link href={`/dashboard/fleet/${vehicle.id}`}>
                      Details <ArrowUpRightIcon className="size-3 ml-1" />
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
