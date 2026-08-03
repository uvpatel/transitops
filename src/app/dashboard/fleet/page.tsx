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
} from "@/components/ui/dialog";
import {
  TruckIcon,
  PlusIcon,
  SearchIcon,
  WrenchIcon,
  ShieldCheckIcon,
  Trash2Icon,
  Loader2Icon,
  CheckCircle2Icon,
  PencilIcon,
  EyeIcon,
  SparklesIcon,
  FuelIcon,
  GaugeIcon,
  CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  make?: string | null;
  model?: string | null;
  manufacturingYear?: number | null;
  fuelType?: string | null;
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
  const [editingVehicleId, setEditingVehicleId] = React.useState<string | null>(null);
  const [viewingVehicle, setViewingVehicle] = React.useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

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

  const handleOpenAdd = () => {
    setEditingVehicleId(null);
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
    setIsAddOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setFormData({
      registrationNumber: v.registrationNumber || "",
      vehicleType: v.vehicleType || "TRUCK",
      make: v.make || "",
      model: v.model || "",
      manufacturingYear: v.manufacturingYear || new Date().getFullYear(),
      fuelType: v.fuelType || "DIESEL",
      capacityKg: v.capacityKg || "",
      odometerKm: v.odometerKm || "",
      status: v.status || "AVAILABLE",
    });
    setIsAddOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.registrationNumber.trim()) {
      toast.error("Registration number is required");
      return;
    }

    if (formData.odometerKm && Number(formData.odometerKm) < 0) {
      toast.error("Odometer reading cannot be negative");
      return;
    }

    if (formData.capacityKg && Number(formData.capacityKg) < 0) {
      toast.error("Payload capacity cannot be negative");
      return;
    }

    try {
      setSubmitting(true);
      const isEditing = Boolean(editingVehicleId);
      const url = "/api/vehicle";
      const method = isEditing ? "PUT" : "POST";
      const payload = isEditing ? { id: editingVehicleId, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} vehicle`);

      toast.success(`Vehicle ${formData.registrationNumber} ${isEditing ? "updated" : "added"} successfully!`);
      setIsAddOpen(false);
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
      (v.model ?? "").toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleType.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = vehicles.filter((v) => v.status === "AVAILABLE" || v.status === "ASSIGNED" || v.status === "IN_TRANSIT").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "MAINTENANCE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Fleet & Vehicle Asset Registry</h2>
          <p className="text-sm text-muted-foreground">Manage vehicles, specs, odometer readings, and status tracking.</p>
        </div>

        <Button size="sm" className="gap-1.5 font-semibold" onClick={handleOpenAdd}>
          <PlusIcon className="size-4" />
          <span>Add New Vehicle</span>
        </Button>
      </div>

      {/* Add / Edit Vehicle Modal with LIVE PREVIEW */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingVehicleId ? <PencilIcon className="size-4 text-primary" /> : <PlusIcon className="size-4 text-primary" />}
              <span>{editingVehicleId ? "Edit Vehicle Details" : "Add New Vehicle"}</span>
            </DialogTitle>
            <DialogDescription>
              {editingVehicleId ? "Modify vehicle specs and odometer with live preview." : "Register a vehicle in your fleet with live editing preview."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
            {/* Form */}
            <form onSubmit={handleSaveVehicle} id="vehicle-form" className="lg:col-span-7 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Reg. Number *</label>
                  <Input
                    required
                    placeholder="e.g. CA-99201"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="mt-1 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_TRANSIT">IN TRANSIT</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Make (Brand)</label>
                  <Input
                    placeholder="e.g. Volvo / Freightliner"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Model</label>
                  <Input
                    placeholder="e.g. VNL 860"
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
                    min="0"
                    placeholder="12000"
                    value={formData.capacityKg}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && Number(val) < 0) {
                        toast.error("Capacity cannot be negative");
                        return;
                      }
                      setFormData({ ...formData, capacityKg: val });
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Odometer (km)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="45000"
                    value={formData.odometerKm}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && Number(val) < 0) {
                        toast.error("Odometer cannot be negative");
                        return;
                      }
                      setFormData({ ...formData, odometerKm: val });
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
            </form>

            {/* LIVE PREVIEW COLUMN */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                    <SparklesIcon className="size-3.5 animate-pulse text-amber-500" /> Vehicle Live Card
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-background font-mono">
                    {formData.vehicleType}
                  </Badge>
                </div>

                <div className="rounded-md border bg-card p-3 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-foreground font-mono">
                        {formData.registrationNumber || "REG-XXXX"}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {formData.make || "Make"} {formData.model || "Model"}
                      </p>
                    </div>
                    <Badge className="text-[10px] bg-primary/15 text-primary border-primary/30">
                      {formData.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FuelIcon className="size-3 text-primary shrink-0" />
                      <span>{formData.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GaugeIcon className="size-3 text-primary shrink-0" />
                      <span>{formData.odometerKm ? `${formData.odometerKm} km` : "0 km"}</span>
                    </div>
                  </div>

                  {formData.capacityKg && (
                    <div className="text-[10px] bg-muted/50 rounded p-1.5 text-muted-foreground">
                      Payload: <strong className="text-foreground">{formData.capacityKg} kg</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="vehicle-form" disabled={submitting}>
              {submitting ? <Loader2Icon className="size-4 animate-spin mr-1" /> : null}
              {editingVehicleId ? "Save Changes" : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Vehicle Modal */}
      <Dialog open={Boolean(viewingVehicle)} onOpenChange={(open) => !open && setViewingVehicle(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TruckIcon className="size-4 text-primary" />
              <span>Vehicle Details Preview</span>
            </DialogTitle>
            <DialogDescription>{viewingVehicle?.registrationNumber}</DialogDescription>
          </DialogHeader>

          {viewingVehicle && (
            <div className="space-y-4 py-2 text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-base font-mono">{viewingVehicle.registrationNumber}</h3>
                  <p className="text-xs text-muted-foreground">{viewingVehicle.make} {viewingVehicle.model}</p>
                </div>
                <Badge variant="outline">{viewingVehicle.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground block font-medium">Type:</span>
                  <span className="font-semibold">{viewingVehicle.vehicleType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Fuel Type:</span>
                  <span className="font-semibold">{viewingVehicle.fuelType || "DIESEL"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Odometer:</span>
                  <span className="font-semibold">{viewingVehicle.odometerKm ? `${viewingVehicle.odometerKm} km` : "0 km"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Payload Capacity:</span>
                  <span className="font-semibold">{viewingVehicle.capacityKg ? `${viewingVehicle.capacityKg} kg` : "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingVehicle(null)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2Icon className="size-4" /> Active Fleet Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Available, assigned or in transit</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <WrenchIcon className="size-4" /> In Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{maintenanceCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Servicing or undergoing repair</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <ShieldCheckIcon className="size-4" /> Total Fleet Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{vehicles.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total assets under management</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center rounded-lg border bg-card p-3 shadow-xs max-w-sm w-full">
          <SearchIcon className="size-4 text-muted-foreground mr-2" />
          <Input
            placeholder="Search reg number, make, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none text-xs focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_TRANSIT">IN TRANSIT</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
          </select>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Reg Number</TableHead>
              <TableHead className="text-xs font-bold">Make & Model</TableHead>
              <TableHead className="text-xs font-bold">Type</TableHead>
              <TableHead className="text-xs font-bold">Odometer</TableHead>
              <TableHead className="text-xs font-bold">Fuel</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin inline mr-2" /> Loading fleet assets...
                </TableCell>
              </TableRow>
            ) : filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((v) => (
                <TableRow key={v.id} className="hover:bg-muted/40 text-xs">
                  <TableCell className="font-semibold text-primary font-mono">{v.registrationNumber}</TableCell>
                  <TableCell>
                    {v.make || v.model ? `${v.make || ""} ${v.model || ""}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {v.vehicleType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[11px]">
                    {v.odometerKm ? `${v.odometerKm} km` : "0 km"}
                  </TableCell>
                  <TableCell>{v.fuelType || "DIESEL"}</TableCell>
                  <TableCell>
                    {v.status === "AVAILABLE" && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                        AVAILABLE
                      </Badge>
                    )}
                    {v.status === "IN_TRANSIT" && (
                      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                        IN TRANSIT
                      </Badge>
                    )}
                    {v.status === "MAINTENANCE" && (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                        MAINTENANCE
                      </Badge>
                    )}
                    {v.status !== "AVAILABLE" && v.status !== "IN_TRANSIT" && v.status !== "MAINTENANCE" && (
                      <Badge variant="secondary" className="text-[10px]">
                        {v.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Preview Details"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setViewingVehicle(v)}
                      >
                        <EyeIcon className="size-3.5" />
                      </Button>

                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Edit Vehicle"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleOpenEdit(v)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>

                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Delete Vehicle"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteVehicle(v.id, v.registrationNumber)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
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
