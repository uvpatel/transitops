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
  UserCheckIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  ShieldCheckIcon,
  ArrowUpRightIcon,
  AlertTriangleIcon,
} from "lucide-react";

const mockDrivers = [
  {
    id: "d-201",
    fullName: "Alexander Wright",
    employeeCode: "DRV-1029",
    licenseNumber: "DL-90812391",
    licenseExpiry: "2027-04-12",
    employmentStatus: "ACTIVE",
    availabilityStatus: "DRIVING",
    safetyScore: "98.5",
  },
  {
    id: "d-202",
    fullName: "Marcus Vance",
    employeeCode: "DRV-1030",
    licenseNumber: "DL-44819200",
    licenseExpiry: "2026-08-10",
    employmentStatus: "ACTIVE",
    availabilityStatus: "AVAILABLE",
    safetyScore: "92.0",
  },
  {
    id: "d-203",
    fullName: "David Miller",
    employeeCode: "DRV-1031",
    licenseNumber: "DL-88219401",
    licenseExpiry: "2026-08-06", // Expiring soon!
    employmentStatus: "ACTIVE",
    availabilityStatus: "OFF_DUTY",
    safetyScore: "86.4",
  },
  {
    id: "d-204",
    fullName: "Sarah Jenkins",
    employeeCode: "DRV-1032",
    licenseNumber: "DL-11928374",
    licenseExpiry: "2028-11-20",
    employmentStatus: "ACTIVE",
    availabilityStatus: "AVAILABLE",
    safetyScore: "99.2",
  },
];

export default function DriversPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Driver Roster & Safety</h2>
          <p className="text-sm text-muted-foreground">Monitor driver availability, license compliance, telematics safety scores, and duty status.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <PlusIcon className="size-4" />
          <span>Register New Driver</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Total Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground mt-0.5">38 Currently Available / On Duty</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-purple-600 dark:text-purple-400">Fleet Safety Index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold flex items-center gap-1">
              95.4 <StarIcon className="size-5 text-amber-500 fill-amber-500" />
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Zero severe safety incidents</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-rose-500/5 border-rose-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-rose-600 dark:text-rose-400">License Expiry Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-rose-600">1 Expiring</p>
            <p className="text-xs text-muted-foreground mt-0.5">Expires within 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Search driver name, employee code, license..." className="pl-8 text-xs h-9" />
        </div>
      </div>

      {/* Driver Roster Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Driver Name</TableHead>
              <TableHead className="text-xs font-bold">Code</TableHead>
              <TableHead className="text-xs font-bold">License #</TableHead>
              <TableHead className="text-xs font-bold">License Expiry</TableHead>
              <TableHead className="text-xs font-bold">Safety Score</TableHead>
              <TableHead className="text-xs font-bold">Duty Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDrivers.map((driver) => (
              <TableRow key={driver.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-semibold text-primary">{driver.fullName}</TableCell>
                <TableCell>{driver.employeeCode}</TableCell>
                <TableCell>{driver.licenseNumber}</TableCell>
                <TableCell>
                  {driver.id === "d-203" ? (
                    <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40">
                      <AlertTriangleIcon className="size-3 mr-1 inline" /> {driver.licenseExpiry}
                    </Badge>
                  ) : (
                    <span>{driver.licenseExpiry}</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{driver.safetyScore} / 100</span>
                </TableCell>
                <TableCell>
                  {driver.availabilityStatus === "DRIVING" && (
                    <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                      DRIVING
                    </Badge>
                  )}
                  {driver.availabilityStatus === "AVAILABLE" && (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                      AVAILABLE
                    </Badge>
                  )}
                  {driver.availabilityStatus === "OFF_DUTY" && (
                    <Badge variant="outline" className="text-muted-foreground">
                      OFF DUTY
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button  size="xs" variant="ghost" className="h-7 px-2">
                    <Link href={`/dashboard/drivers/${driver.id}`}>
                      Profile <ArrowUpRightIcon className="size-3 ml-1" />
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
