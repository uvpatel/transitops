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
  WrenchIcon,
  PlusIcon,
  SearchIcon,
  CheckCircle2Icon,
  ClockIcon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  maintenanceType: string;
  priority: string;
  status: string;
  reportedIssue: string;
  laborCost?: string | null;
  partsCost?: string | null;
  totalCost?: string | null;
  vehicle?: { id: string; registrationNumber: string } | null;
}

interface Vehicle {
  id: string;
  registrationNumber: string;
}

export default function MaintenancePage() {
  const [workOrders, setWorkOrders] = React.useState<WorkOrder[]>([]);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    vehicleId: "",
    maintenanceType: "OIL_CHANGE",
    priority: "NORMAL",
    reportedIssue: "",
    laborCost: "0",
    partsCost: "0",
  });

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [ordersRes, vehiclesRes] = await Promise.all([
        fetch("/api/maintenance").then((r) => r.json()),
        fetch("/api/vehicle").then((r) => r.json()),
      ]);

      setWorkOrders(ordersRes.workOrders || []);
      setVehicles(vehiclesRes.vehicles || []);
    } catch {
      toast.error("Failed to load maintenance work orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.reportedIssue) {
      toast.error("Vehicle and issue description are required");
      return;
    }

    if (Number(formData.laborCost) < 0 || Number(formData.partsCost) < 0) {
      toast.error("Labor cost and parts cost cannot be negative");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create work order");

      toast.success(`Work Order created (${data.workOrder?.workOrderNumber || ""}). Vehicle set to MAINTENANCE.`);
      setIsAddOpen(false);
      setFormData({
        vehicleId: "",
        maintenanceType: "OIL_CHANGE",
        priority: "NORMAL",
        reportedIssue: "",
        laborCost: "0",
        partsCost: "0",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create work order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/maintenance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      toast.success(`Work Order status changed to ${status}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update work order");
    }
  };

  const handleDeleteWorkOrder = async (id: string, woNum: string) => {
    if (!confirm(`Are you sure you want to delete work order ${woNum}?`)) return;
    try {
      const res = await fetch(`/api/maintenance?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(`Work Order ${woNum} deleted.`);
      fetchData();
    } catch {
      toast.error("Error deleting work order.");
    }
  };

  const filteredOrders = workOrders.filter(
    (w) =>
      w.workOrderNumber.toLowerCase().includes(search.toLowerCase()) ||
      w.reportedIssue.toLowerCase().includes(search.toLowerCase()) ||
      (w.vehicle?.registrationNumber ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openCount = workOrders.filter((w) => w.status !== "COMPLETED" && w.status !== "CANCELLED").length;
  const completedCount = workOrders.filter((w) => w.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Maintenance & Work Orders</h2>
          <p className="text-sm text-muted-foreground">Schedule service work, track component replacement, and log maintenance costs.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-1.5 font-semibold" />}>
            <PlusIcon className="size-4" />
            <span>New Work Order</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Service Work Order</DialogTitle>
              <DialogDescription>Schedule vehicle service and log reported issues.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWorkOrder} className="space-y-3 py-2">
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
                      {v.registrationNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Maintenance Type</label>
                  <select
                    value={formData.maintenanceType}
                    onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="OIL_CHANGE">OIL CHANGE</option>
                    <option value="GENERAL_SERVICE">GENERAL SERVICE</option>
                    <option value="TYRE_REPLACEMENT">TYRE REPLACEMENT</option>
                    <option value="BRAKE_SERVICE">BRAKE SERVICE</option>
                    <option value="ENGINE_SERVICE">ENGINE SERVICE</option>
                    <option value="INSPECTION">INSPECTION</option>
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

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Reported Issue / Notes *</label>
                <Input
                  required
                  placeholder="Engine oil replacement & filter check..."
                  value={formData.reportedIssue}
                  onChange={(e) => setFormData({ ...formData, reportedIssue: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Est. Labor Cost ($)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="150"
                    value={formData.laborCost}
                    onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Est. Parts Cost ($)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="300"
                    value={formData.partsCost}
                    onChange={(e) => setFormData({ ...formData, partsCost: e.target.value })}
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
                  Save Work Order
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="shadow-xs bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <ClockIcon className="size-4" /> Open Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{openCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Vehicles currently in service</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2Icon className="size-4" /> Completed Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Service complete & restored to fleet</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center rounded-lg border bg-card p-3 shadow-xs max-w-sm">
        <SearchIcon className="size-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search work order #, vehicle, issue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none text-xs focus-visible:ring-0"
        />
      </div>

      {/* Work Orders Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">WO Number</TableHead>
              <TableHead className="text-xs font-bold">Vehicle</TableHead>
              <TableHead className="text-xs font-bold">Type & Priority</TableHead>
              <TableHead className="text-xs font-bold">Reported Issue</TableHead>
              <TableHead className="text-xs font-bold">Est. Total Cost</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin inline mr-2" /> Loading work orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  No work orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((wo) => (
                <TableRow key={wo.id} className="hover:bg-muted/40 text-xs">
                  <TableCell className="font-semibold text-primary font-mono">{wo.workOrderNumber}</TableCell>
                  <TableCell className="font-semibold">{wo.vehicle ? wo.vehicle.registrationNumber : "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px]">
                        {wo.maintenanceType}
                      </Badge>
                      <Badge
                        variant={wo.priority === "HIGH" || wo.priority === "URGENT" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {wo.priority}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{wo.reportedIssue}</TableCell>
                  <TableCell className="font-semibold">${Number(wo.totalCost || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    {wo.status === "OPEN" && (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                        OPEN
                      </Badge>
                    )}
                    {wo.status === "IN_PROGRESS" && (
                      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                        IN PROGRESS
                      </Badge>
                    )}
                    {wo.status === "COMPLETED" && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                        COMPLETED
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    {wo.status === "OPEN" && (
                      <Button
                        size="xs"
                        variant="outline"
                        className="h-7 text-[11px] bg-blue-500/10 text-blue-600 border-blue-500/20"
                        onClick={() => handleUpdateStatus(wo.id, "IN_PROGRESS")}
                      >
                        Start Service
                      </Button>
                    )}
                    {wo.status === "IN_PROGRESS" && (
                      <Button
                        size="xs"
                        variant="outline"
                        className="h-7 text-[11px] bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => handleUpdateStatus(wo.id, "COMPLETED")}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 ml-1"
                      onClick={() => handleDeleteWorkOrder(wo.id, wo.workOrderNumber)}
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
