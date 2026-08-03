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
  NavigationIcon,
  PlusIcon,
  SearchIcon,
  CheckCircle2Icon,
  ClockIcon,
  PlayIcon,
  Trash2Icon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Trip {
  id: string;
  tripNumber: string;
  title: string;
  tripType: string;
  priority: string;
  status: string;
  originName?: string | null;
  destinationName?: string | null;
  estimatedDistanceKm?: string | null;
  vehicle?: { id: string; registrationNumber: string; status: string } | null;
  driver?: { id: string; fullName: string; availabilityStatus: string } | null;
}

interface Vehicle {
  id: string;
  registrationNumber: string;
  status: string;
}

interface Driver {
  id: string;
  fullName: string;
  availabilityStatus: string;
}

export default function TripsPage() {
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    tripType: "DELIVERY",
    priority: "NORMAL",
    status: "ASSIGNED",
    originName: "",
    destinationName: "",
    estimatedDistanceKm: "",
    vehicleId: "",
    driverId: "",
  });

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch("/api/trips").then((r) => r.json()),
        fetch("/api/vehicle").then((r) => r.json()),
        fetch("/api/drivers").then((r) => r.json()),
      ]);

      setTrips(tripsRes.trips || []);
      setVehicles(vehiclesRes.vehicles || []);
      setDrivers(driversRes.drivers || []);
    } catch {
      toast.error("Failed to load trip dispatch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.originName || !formData.destinationName) {
      toast.error("Title, origin, and destination are required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create trip");

      toast.success(`Trip dispatched successfully! (${data.trip?.tripNumber || ""})`);
      setIsAddOpen(false);
      setFormData({
        title: "",
        tripType: "DELIVERY",
        priority: "NORMAL",
        status: "ASSIGNED",
        originName: "",
        destinationName: "",
        estimatedDistanceKm: "",
        vehicleId: "",
        driverId: "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to dispatch trip");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/trips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update trip status");

      toast.success(`Trip status updated to ${status}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update trip");
    }
  };

  const handleDeleteTrip = async (id: string, tripNum: string) => {
    if (!confirm(`Are you sure you want to delete trip ${tripNum}?`)) return;
    try {
      const res = await fetch(`/api/trips?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(`Trip ${tripNum} deleted.`);
      fetchData();
    } catch {
      toast.error("Error deleting trip.");
    }
  };

  const filteredTrips = trips.filter(
    (t) =>
      t.tripNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.originName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.destinationName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeTripsCount = trips.filter((t) => t.status === "IN_PROGRESS" || t.status === "ASSIGNED").length;
  const completedTripsCount = trips.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Trip Dispatch & Telematics</h2>
          <p className="text-sm text-muted-foreground">Manage active delivery routes, vehicle assignments, and trip status transitions.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-1.5 font-semibold" />}>
            <PlusIcon className="size-4" />
            <span>Create New Trip</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Dispatch New Trip</DialogTitle>
              <DialogDescription>Assign an available vehicle and driver to a route.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTrip} className="space-y-3 py-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Trip Title / Description *</label>
                <Input
                  required
                  placeholder="e.g. Express Delivery - Distribution Hub B"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Origin Address / Location *</label>
                  <Input
                    required
                    placeholder="Central Warehouse"
                    value={formData.originName}
                    onChange={(e) => setFormData({ ...formData, originName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Destination Location *</label>
                  <Input
                    required
                    placeholder="Downtown Terminal"
                    value={formData.destinationName}
                    onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Trip Type</label>
                  <select
                    value={formData.tripType}
                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="DELIVERY">DELIVERY</option>
                    <option value="PICKUP">PICKUP</option>
                    <option value="TRANSFER">TRANSFER</option>
                    <option value="SERVICE">SERVICE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Assign Vehicle</label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="">-- Select Vehicle --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id} disabled={v.status === "MAINTENANCE"}>
                        {v.registrationNumber} ({v.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Assign Driver</label>
                  <select
                    value={formData.driverId}
                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="">-- Select Driver --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id} disabled={d.availabilityStatus === "DRIVING"}>
                        {d.fullName} ({d.availabilityStatus})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Est. Distance (km)</label>
                <Input
                  type="number"
                  placeholder="145"
                  value={formData.estimatedDistanceKm}
                  onChange={(e) => setFormData({ ...formData, estimatedDistanceKm: e.target.value })}
                  className="mt-1"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2Icon className="size-4 animate-spin mr-1" /> : null}
                  Dispatch Trip
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="shadow-xs bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <ClockIcon className="size-4" /> Active / Dispatched Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeTripsCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">En route or assigned</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2Icon className="size-4" /> Completed Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedTripsCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Delivered and fulfilled</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center rounded-lg border bg-card p-3 shadow-xs max-w-sm">
        <SearchIcon className="size-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search trip number, origin, destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none text-xs focus-visible:ring-0"
        />
      </div>

      {/* Trips Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Trip Number</TableHead>
              <TableHead className="text-xs font-bold">Title / Route</TableHead>
              <TableHead className="text-xs font-bold">Assigned Vehicle</TableHead>
              <TableHead className="text-xs font-bold">Assigned Driver</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin inline mr-2" /> Loading trips...
                </TableCell>
              </TableRow>
            ) : filteredTrips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                  No trips found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrips.map((trip) => (
                <TableRow key={trip.id} className="hover:bg-muted/40 text-xs">
                  <TableCell className="font-semibold text-primary font-mono">{trip.tripNumber}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{trip.title}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <NavigationIcon className="size-3 text-muted-foreground" />
                      {trip.originName || "Origin"} &rarr; {trip.destinationName || "Destination"}
                    </div>
                  </TableCell>
                  <TableCell>{trip.vehicle ? trip.vehicle.registrationNumber : "Unassigned"}</TableCell>
                  <TableCell>{trip.driver ? trip.driver.fullName : "Unassigned"}</TableCell>
                  <TableCell>
                    {trip.status === "IN_PROGRESS" && (
                      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                        IN PROGRESS
                      </Badge>
                    )}
                    {trip.status === "COMPLETED" && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                        COMPLETED
                      </Badge>
                    )}
                    {trip.status === "ASSIGNED" && (
                      <Badge variant="outline" className="text-[10px]">
                        ASSIGNED
                      </Badge>
                    )}
                    {trip.status === "CANCELLED" && (
                      <Badge variant="destructive" className="text-[10px]">
                        CANCELLED
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    {trip.status === "ASSIGNED" && (
                      <Button
                        size="xs"
                        variant="outline"
                        className="h-7 text-[11px] gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                        onClick={() => handleUpdateStatus(trip.id, "IN_PROGRESS")}
                      >
                        <PlayIcon className="size-3" /> Start
                      </Button>
                    )}
                    {trip.status === "IN_PROGRESS" && (
                      <Button
                        size="xs"
                        variant="outline"
                        className="h-7 text-[11px] gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => handleUpdateStatus(trip.id, "COMPLETED")}
                      >
                        <CheckCircle2Icon className="size-3" /> Complete
                      </Button>
                    )}
                    {trip.status !== "COMPLETED" && trip.status !== "CANCELLED" && (
                      <Button
                        size="xs"
                        variant="ghost"
                        className="h-7 text-[11px] text-muted-foreground hover:text-destructive"
                        onClick={() => handleUpdateStatus(trip.id, "CANCELLED")}
                      >
                        <XCircleIcon className="size-3" />
                      </Button>
                    )}
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 ml-1"
                      onClick={() => handleDeleteTrip(trip.id, trip.tripNumber)}
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
