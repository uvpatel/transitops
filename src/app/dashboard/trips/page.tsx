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
  NavigationIcon,
  PlusIcon,
  SearchIcon,
  CheckCircle2Icon,
  ClockIcon,
  PlayIcon,
  Trash2Icon,
  Loader2Icon,
  XCircleIcon,
  PencilIcon,
  EyeIcon,
  SparklesIcon,
  MapPinIcon,
  TruckIcon,
  UserIcon,
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
  const [editingTripId, setEditingTripId] = React.useState<string | null>(null);
  const [viewingTrip, setViewingTrip] = React.useState<Trip | null>(null);
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

  const handleOpenAdd = () => {
    setEditingTripId(null);
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
    setIsAddOpen(true);
  };

  const handleOpenEdit = (trip: Trip) => {
    setEditingTripId(trip.id);
    setFormData({
      title: trip.title || "",
      tripType: trip.tripType || "DELIVERY",
      priority: trip.priority || "NORMAL",
      status: trip.status || "ASSIGNED",
      originName: trip.originName || "",
      destinationName: trip.destinationName || "",
      estimatedDistanceKm: trip.estimatedDistanceKm || "",
      vehicleId: trip.vehicle?.id || "",
      driverId: trip.driver?.id || "",
    });
    setIsAddOpen(true);
  };

  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.originName || !formData.destinationName) {
      toast.error("Title, origin, and destination are required");
      return;
    }

    // Distance cannot be negative check
    if (formData.estimatedDistanceKm && Number(formData.estimatedDistanceKm) < 0) {
      toast.error("Distance cannot be negative");
      return;
    }

    try {
      setSubmitting(true);
      const isEditing = Boolean(editingTripId);
      const url = "/api/trips";
      const method = isEditing ? "PUT" : "POST";
      const payload = isEditing
        ? { id: editingTripId, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} trip`);

      toast.success(`Trip ${isEditing ? "updated" : "dispatched"} successfully!`);
      setIsAddOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save trip");
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
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Trip status updated to ${status}`);
      fetchData();
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleDeleteTrip = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to cancel and remove trip "${title}"?`)) return;
    try {
      const res = await fetch(`/api/trips?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trip");
      toast.success(`Trip "${title}" removed.`);
      fetchData();
    } catch {
      toast.error("Error removing trip.");
    }
  };

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tripNumber.toLowerCase().includes(search.toLowerCase()) ||
      (t.originName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.destinationName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeTripsCount = trips.filter((t) => t.status === "ASSIGNED" || t.status === "IN_PROGRESS").length;
  const completedTripsCount = trips.filter((t) => t.status === "COMPLETED").length;

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
  const selectedDriver = drivers.find((d) => d.id === formData.driverId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Trips & Dispatch Command</h2>
          <p className="text-sm text-muted-foreground">Manage active freight movement, route assignments, and fulfillment.</p>
        </div>

        <Button size="sm" className="gap-1.5 font-semibold" onClick={handleOpenAdd}>
          <PlusIcon className="size-4" />
          <span>Dispatch New Trip</span>
        </Button>
      </div>

      {/* Add / Edit Trip Dialog with LIVE PREVIEW */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingTripId ? <PencilIcon className="size-4 text-primary" /> : <PlusIcon className="size-4 text-primary" />}
              <span>{editingTripId ? "Edit Trip Details" : "Dispatch New Trip"}</span>
            </DialogTitle>
            <DialogDescription>
              {editingTripId ? "Modify route, status, or driver/vehicle assignment with live preview." : "Create and assign a new dispatch route with live preview."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
            {/* Form */}
            <form onSubmit={handleSaveTrip} id="trip-form" className="lg:col-span-7 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Trip Title / Description *</label>
                <Input
                  required
                  placeholder="e.g. Regional Freight Delivery - Route #4"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Origin *</label>
                  <Input
                    required
                    placeholder="Chicago Depot #2"
                    value={formData.originName}
                    onChange={(e) => setFormData({ ...formData, originName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Destination *</label>
                  <Input
                    required
                    placeholder="Detroit Logistics Hub"
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
                  min="0"
                  placeholder="145"
                  value={formData.estimatedDistanceKm}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && Number(val) < 0) {
                      toast.error("Distance cannot be negative");
                      return;
                    }
                    setFormData({ ...formData, estimatedDistanceKm: val });
                  }}
                  className="mt-1"
                />
                <span className="text-[10px] text-muted-foreground">Distance must be non-negative (≥ 0 km).</span>
              </div>
            </form>

            {/* LIVE PREVIEW COLUMN */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                    <SparklesIcon className="size-3.5 animate-pulse text-amber-500" /> Trip Live Preview
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-background">
                    {formData.priority}
                  </Badge>
                </div>

                <div className="rounded-md border bg-card p-3 shadow-xs space-y-2.5">
                  <div className="border-b pb-2">
                    <h4 className="font-bold text-sm text-foreground">
                      {formData.title || "Trip Title"}
                    </h4>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {editingTripId ? "EDITING TRIP" : "NEW DISPATCH"}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon className="size-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{formData.originName || "Origin"} &rarr; {formData.destinationName || "Destination"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <NavigationIcon className="size-3 text-primary shrink-0" />
                      <span>Est. Distance: <strong className="text-foreground">{formData.estimatedDistanceKm ? `${formData.estimatedDistanceKm} km` : "0 km"}</strong></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-muted/40 p-2 rounded">
                    <div>
                      <span className="text-muted-foreground block text-[10px] flex items-center gap-1">
                        <TruckIcon className="size-3" /> Vehicle
                      </span>
                      <span className="font-semibold text-foreground">{selectedVehicle ? selectedVehicle.registrationNumber : "Unassigned"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] flex items-center gap-1">
                        <UserIcon className="size-3" /> Driver
                      </span>
                      <span className="font-semibold text-foreground">{selectedDriver ? selectedDriver.fullName : "Unassigned"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="trip-form" disabled={submitting}>
              {submitting ? <Loader2Icon className="size-4 animate-spin mr-1" /> : null}
              {editingTripId ? "Save Changes" : "Dispatch Trip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Trip Modal */}
      <Dialog open={Boolean(viewingTrip)} onOpenChange={(open) => !open && setViewingTrip(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <NavigationIcon className="size-4 text-primary" />
              <span>Trip Details Preview</span>
            </DialogTitle>
            <DialogDescription>{viewingTrip?.tripNumber} - {viewingTrip?.title}</DialogDescription>
          </DialogHeader>

          {viewingTrip && (
            <div className="space-y-4 py-2 text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-base">{viewingTrip.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPinIcon className="size-3 text-primary" /> {viewingTrip.originName} &rarr; {viewingTrip.destinationName}
                  </p>
                </div>
                <Badge variant="outline">{viewingTrip.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground block font-medium">Type:</span>
                  <span className="font-semibold">{viewingTrip.tripType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Priority:</span>
                  <Badge variant="secondary" className="mt-0.5">{viewingTrip.priority}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Est. Distance:</span>
                  <span className="font-semibold">{viewingTrip.estimatedDistanceKm ? `${viewingTrip.estimatedDistanceKm} km` : "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Vehicle:</span>
                  <span className="font-semibold">{viewingTrip.vehicle?.registrationNumber || "Unassigned"}</span>
                </div>
              </div>

              <div className="rounded-md border bg-muted/30 p-2.5">
                <span className="font-semibold block text-muted-foreground">Assigned Driver:</span>
                <p className="font-medium text-foreground">{viewingTrip.driver?.fullName || "No Driver Assigned"}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingTrip(null)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                      {trip.estimatedDistanceKm ? ` (${trip.estimatedDistanceKm} km)` : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    {trip.vehicle ? (
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {trip.vehicle.registrationNumber}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground font-italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {trip.driver ? (
                      <div className="font-medium text-foreground">{trip.driver.fullName}</div>
                    ) : (
                      <span className="text-muted-foreground font-italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {trip.status === "COMPLETED" && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                        COMPLETED
                      </Badge>
                    )}
                    {trip.status === "IN_PROGRESS" && (
                      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                        IN PROGRESS
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
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {trip.status === "ASSIGNED" && (
                        <Button
                          size="xs"
                          variant="outline"
                          className="h-6 text-[10px] gap-1 text-blue-600 border-blue-500/30"
                          onClick={() => handleUpdateStatus(trip.id, "IN_PROGRESS")}
                        >
                          <PlayIcon className="size-3" /> Start
                        </Button>
                      )}

                      {trip.status === "IN_PROGRESS" && (
                        <Button
                          size="xs"
                          variant="outline"
                          className="h-6 text-[10px] gap-1 text-emerald-600 border-emerald-500/30"
                          onClick={() => handleUpdateStatus(trip.id, "COMPLETED")}
                        >
                          <CheckCircle2Icon className="size-3" /> Finish
                        </Button>
                      )}

                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Preview Trip"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setViewingTrip(trip)}
                      >
                        <EyeIcon className="size-3.5" />
                      </Button>

                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Edit Trip"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleOpenEdit(trip)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>

                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Delete Trip"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteTrip(trip.id, trip.title)}
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
