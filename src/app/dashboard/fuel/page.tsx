import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FuelIcon, PlusIcon, TrendingDownIcon, MapPinIcon } from "lucide-react";

const mockFuelLogs = [
  {
    id: "f-501",
    vehicle: "TRK-9081",
    driver: "Alexander Wright",
    date: "2026-08-01",
    liters: "450.0 L",
    pricePerLiter: "$1.42",
    totalAmount: "$639.00",
    station: "Shell MegaStation #401",
    efficiency: "3.4 km/L",
  },
  {
    id: "f-502",
    vehicle: "VAN-4022",
    driver: "Sarah Jenkins",
    date: "2026-08-02",
    liters: "75.0 L",
    pricePerLiter: "$1.38",
    totalAmount: "$103.50",
    station: "Exxon Express",
    efficiency: "10.2 km/L",
  },
];

export default function FuelPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Fuel Logs & Telematics</h2>
          <p className="text-sm text-muted-foreground">Track fuel consumption, station locations, receipt audit trails, and km/L efficiency.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <PlusIcon className="size-4" />
          <span>Log Fuel Entry</span>
        </Button>
      </div>

      {/* Fuel Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-blue-600 dark:text-blue-400">Total Fuel Volume (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14,280 Liters</p>
            <p className="text-xs text-muted-foreground mt-0.5">Avg price: $1.40 / L</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-purple-600 dark:text-purple-400">Total Fuel Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$19,992.00</p>
            <p className="text-xs text-muted-foreground mt-0.5">52% of total operational cost</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Fleet Average Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3.8 km / L</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">+4.5% efficiency improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Logs Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Date</TableHead>
              <TableHead className="text-xs font-bold">Vehicle</TableHead>
              <TableHead className="text-xs font-bold">Driver</TableHead>
              <TableHead className="text-xs font-bold">Volume (L)</TableHead>
              <TableHead className="text-xs font-bold">Price / L</TableHead>
              <TableHead className="text-xs font-bold">Total Amount</TableHead>
              <TableHead className="text-xs font-bold">Fuel Station</TableHead>
              <TableHead className="text-xs font-bold">Calculated Efficiency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFuelLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-semibold text-primary">{log.date}</TableCell>
                <TableCell className="font-medium">{log.vehicle}</TableCell>
                <TableCell>{log.driver}</TableCell>
                <TableCell>{log.liters}</TableCell>
                <TableCell>{log.pricePerLiter}</TableCell>
                <TableCell className="font-bold">{log.totalAmount}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="size-3 text-muted-foreground" /> {log.station}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
                    {log.efficiency}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
