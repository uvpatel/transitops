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
  PlusIcon,
  SearchIcon,
  FilterIcon,
  WrenchIcon,
  FuelIcon,
  CheckCircle2Icon,
  ClockIcon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  make?: string | null;
  model?: string | null;
  manufacturingYear?: number | null;
  fuelType: string;
  capacityKg?: string | null;
  odometerKm?: string | null;
  status: string;
}

export default function FleetPage() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    registrationNumber: "",
    vehicleType: "TRUCK",
    make: "",
    model: "",
    manufacturingYear: new Date().getFullYear(),
    fuelType: "DIESEL",
    capacityKg: "",
    odometerKm: "",
    status: "AVAILABLE",
  });

  const fetchVehicles = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vehicle");
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch {
      toast.error("Failed to load vehicles from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.registrationNumber) {
      toast.error("Registration number is required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create vehicle");

      toast.success(`Vehicle ${formData.registrationNumber} added successfully!`);
      setIsAddOpen(false);
      setFormData({
        registrationNumber: "",
        vehicleType: "TRUCK",
        make: "",
        model: "",
        manufacturingYear: new Date().getFullYear(),
        fuelType: "DIESEL",
        capacityKg: "",
        odometerKm: "",
        status: "AVAILABLE",
      });
      fetchVehicles();
    } catch (err: any) {
      toast.error(err.message || "Failed to save vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string, reg: string) => {
    if (!confirm(`Are you sure you want to delete vehicle ${reg}?`)) return;
    try {
      const res = await fetch(`/api/vehicle?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(`Vehicle ${reg} deleted.`);
      fetchVehicles();
    } catch {
      toast.error("Error deleting vehicle.");
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      (v.make ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (v.model ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableVehicles = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const inTransitVehicles = vehicles.filter((v) => v.status === "IN_TRANSIT").length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === "MAINTENANCE").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Fleet Vehicles</h2>
          <p className="text-sm text-muted-foreground">Manage your organization's vehicles, capacity, insurance, and service history.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-1.5 font-semibold" />}>
            <PlusIcon className="size-4" />
            <span>Add New Vehicle</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Vehicle</DialogTitle>
              <DialogDescription>Add a new vehicle to your fleet telematics inventory.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateVehicle} className="space-y-3 py-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Registration Number *</label>
                <Input
                  required
                  placeholder="e.g. TRK-9901"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Make</label>
                  <Input
                    placeholder="Volvo, Mercedes..."
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Model</label>
                  <Input
                    placeholder="FH16, Sprinter..."
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Vehicle Type</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="TRUCK">TRUCK</option>
                    <option value="VAN">VAN</option>
                    <option value="BUS">BUS</option>
                    <option value="CAR">CAR</option>
                    <option value="TRAILER">TRAILER</option>
                    <option value="TANKER">TANKER</option>
                    <option value="PICKUP">PICKUP</option>
                  </select>
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
                    <option value="HYBRID">HYBRID</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Payload Capacity (kg)</label>
                  <Input
                    type="number"
                    placeholder="12000"
                    value={formData.capacityKg}
                    onChange={(e) => setFormData({ ...formData, capacityKg: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Initial Odometer (km)</label>
                  <Input
                    type="number"
                    placeholder="45000"
                    value={formData.odometerKm}
                    onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2Icon className="size-4 animate-spin mr-1" /> : null}
                  Register Vehicle
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
            <p className="text-2xl font-bold">{availableVehicles}</p>
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
            <p className="text-2xl font-bold">{inTransitVehicles}</p>
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
            <p className="text-2xl font-bold">{maintenanceVehicles}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Service & work orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-card p-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search registration, make, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="IN_TRANSIT">IN TRANSIT</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin inline mr-2" /> Loading vehicles...
                </TableCell>
              </TableRow>
            ) : filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                  No vehicles found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-muted/40 text-xs">
                  <TableCell className="font-semibold text-primary">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{`${vehicle.make ?? ""} ${vehicle.model ?? ""}`.trim() || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {vehicle.vehicleType}
                    </Badge>
                  </TableCell>
                  <TableCell>{vehicle.capacityKg ? `${vehicle.capacityKg} kg` : "—"}</TableCell>
                  <TableCell>{vehicle.odometerKm ? `${vehicle.odometerKm} km` : "—"}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 font-medium">
                      <FuelIcon className="size-3 text-muted-foreground" /> {vehicle.fuelType}
                    </span>
                  </TableCell>
                  <TableCell>
                    {vehicle.status === "AVAILABLE" && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                        AVAILABLE
                      </Badge>
                    )}
                    {vehicle.status === "IN_TRANSIT" && (
                      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                        IN TRANSIT
                      </Badge>
                    )}
                    {vehicle.status === "MAINTENANCE" && (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                        MAINTENANCE
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteVehicle(vehicle.id, vehicle.registrationNumber)}
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
