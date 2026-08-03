"use client";

import * as React from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FuelIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  Loader2Icon,
  GaugeIcon,
} from "lucide-react";
import { toast } from "sonner";

interface FuelLog {
  id: string;
  fuelType: string;
  quantityLiters: string;
  pricePerLiter: string;
  totalAmount: string;
  odometerKm: string;
  fuelStationName?: string | null;
  filledAt?: string | null;
  vehicle?: { id: string; registrationNumber: string } | null;
  driver?: { id: string; fullName: string } | null;
}

interface Vehicle {
  id: string;
  registrationNumber: string;
  odometerKm?: string | null;
}

interface Driver {
  id: string;
  fullName: string;
}

export default function FuelPage() {
  const [fuelLogs, setFuelLogs] = React.useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    vehicleId: "",
    driverId: "",
    fuelType: "DIESEL",
    quantityLiters: "",
    pricePerLiter: "",
    odometerKm: "",
    fuelStationName: "",
    receiptNumber: "",
  });

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [fuelRes, vRes, dRes] = await Promise.all([
        fetch("/api/fuel-logs").then((r) => r.json()),
        fetch("/api/vehicle").then((r) => r.json()),
        fetch("/api/drivers").then((r) => r.json()),
      ]);

      setFuelLogs(fuelRes.fuelLogs || []);
      setVehicles(vRes.vehicles || []);
      setDrivers(dRes.drivers || []);
    } catch {
      toast.error("Failed to load fuel logs.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRecordFuel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.quantityLiters || !formData.pricePerLiter) {
      toast.error("Vehicle, quantity, and price per liter are required");
      return;
    }

    if (Number(formData.quantityLiters) < 0 || Number(formData.pricePerLiter) < 0 || (formData.odometerKm && Number(formData.odometerKm) < 0)) {
      toast.error("Fuel quantity, price, and odometer reading cannot be negative");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/fuel-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record fuel log");

      toast.success(`Fuel refill recorded! Vehicle odometer updated.`);
      setIsAddOpen(false);
      setFormData({
        vehicleId: "",
        driverId: "",
        fuelType: "DIESEL",
        quantityLiters: "",
        pricePerLiter: "",
        odometerKm: "",
        fuelStationName: "",
        receiptNumber: "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to record fuel log");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFuel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fuel log entry?")) return;
    try {
      const res = await fetch(`/api/fuel-logs?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Fuel log entry deleted.");
      fetchData();
    } catch {
      toast.error("Error deleting fuel log entry.");
    }
  };

  const filteredLogs = fuelLogs.filter(
    (f) =>
      (f.vehicle?.registrationNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (f.fuelStationName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (f.driver?.fullName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + (Number(f.totalAmount) || 0), 0);
  const totalLiters = fuelLogs.reduce((sum, f) => sum + (Number(f.quantityLiters) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Fuel Telematics & Refills</h2>
          <p className="text-sm text-muted-foreground">Monitor fuel consumption, refill logs, station receipts, and mileage efficiency.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-1.5 font-semibold" />}>
            <PlusIcon className="size-4" />
            <span>Log Fuel Refill</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record Fuel Refill</DialogTitle>
              <DialogDescription>Log a fuel transaction and update vehicle odometer reading.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRecordFuel} className="space-y-3 py-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Target Vehicle *</label>
                <select
                  required
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="">-- Select Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} (Current: {v.odometerKm || 0} km)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Quantity (Liters) *</label>
                  <Input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="85.5"
                    value={formData.quantityLiters}
                    onChange={(e) => setFormData({ ...formData, quantityLiters: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price per Liter ($) *</label>
                  <Input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1.45"
                    value={formData.pricePerLiter}
                    onChange={(e) => setFormData({ ...formData, pricePerLiter: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Odometer Reading (km)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="48200"
                    value={formData.odometerKm}
                    onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="DIESEL">DIESEL</option>
                    <option value="PETROL">PETROL</option>
                    <option value="ELECTRIC">ELECTRIC</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Fuel Station Name</label>
                <Input
                  placeholder="Shell Express #402"
                  value={formData.fuelStationName}
                  onChange={(e) => setFormData({ ...formData, fuelStationName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Refueling Driver</label>
                <select
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="">-- Select Driver --</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2Icon className="size-4 animate-spin mr-1" /> : null}
                  Record Refill
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <FuelIcon className="size-4" /> Total Fuel Expenditure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalFuelCost.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{totalLiters.toFixed(1)} liters pumped</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <GaugeIcon className="size-4" /> Total Refill Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fuelLogs.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Logs verified with telemetry</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center rounded-lg border bg-card p-3 shadow-xs max-w-sm">
        <SearchIcon className="size-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search vehicle, station, driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none text-xs focus-visible:ring-0"
        />
      </div>

      {/* Fuel Logs Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Vehicle</TableHead>
              <TableHead className="text-xs font-bold">Driver</TableHead>
              <TableHead className="text-xs font-bold">Fuel Type & Station</TableHead>
              <TableHead className="text-xs font-bold">Quantity (L)</TableHead>
              <TableHead className="text-xs font-bold">Rate ($/L)</TableHead>
              <TableHead className="text-xs font-bold">Total Cost</TableHead>
              <TableHead className="text-xs font-bold">Odometer</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin inline mr-2" /> Loading fuel logs...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                  No fuel logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/40 text-xs">
                  <TableCell className="font-semibold text-primary">
                    {log.vehicle ? log.vehicle.registrationNumber : "—"}
                  </TableCell>
                  <TableCell>{log.driver ? log.driver.fullName : "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px]">
                        {log.fuelType}
                      </Badge>
                      <span className="text-muted-foreground">{log.fuelStationName || "Station"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{Number(log.quantityLiters).toFixed(2)} L</TableCell>
                  <TableCell>${Number(log.pricePerLiter).toFixed(2)}</TableCell>
                  <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">
                    ${Number(log.totalAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>{log.odometerKm ? `${log.odometerKm} km` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteFuel(log.id)}
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
