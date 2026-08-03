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
  UserPlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  Trash2Icon,
  Loader2Icon,
  CheckCircle2Icon,
  PencilIcon,
  EyeIcon,
  SparklesIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Driver {
  id: string;
  fullName: string;
  employeeCode?: string | null;
  email?: string | null;
  phone?: string | null;
  employmentStatus: string;
  availabilityStatus: string;
  currentSafetyScore?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  totalDistanceKm?: string | null;
}

export default function DriversPage() {
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingDriverId, setEditingDriverId] = React.useState<string | null>(null);
  const [viewingDriver, setViewingDriver] = React.useState<Driver | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    employeeCode: "",
    employmentStatus: "ACTIVE",
    availabilityStatus: "AVAILABLE",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const fetchDrivers = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/drivers");
      const data = await res.json();
      setDrivers(data.drivers || []);
    } catch {
      toast.error("Failed to load drivers from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleOpenAdd = () => {
    setEditingDriverId(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      employeeCode: "",
      employmentStatus: "ACTIVE",
      availabilityStatus: "AVAILABLE",
      emergencyContactName: "",
      emergencyContactPhone: "",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setEditingDriverId(driver.id);
    setFormData({
      fullName: driver.fullName || "",
      email: driver.email || "",
      phone: driver.phone || "",
      employeeCode: driver.employeeCode || "",
      employmentStatus: driver.employmentStatus || "ACTIVE",
      availabilityStatus: driver.availabilityStatus || "AVAILABLE",
      emergencyContactName: driver.emergencyContactName || "",
      emergencyContactPhone: driver.emergencyContactPhone || "",
    });
    setIsAddOpen(true);
  };

  const handleSaveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      setSubmitting(true);
      const isEditing = Boolean(editingDriverId);
      const url = "/api/drivers";
      const method = isEditing ? "PUT" : "POST";
      const payload = isEditing
        ? { id: editingDriverId, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isEditing ? "update" : "register"} driver`);

      toast.success(`Driver ${formData.fullName} ${isEditing ? "updated" : "registered"} successfully!`);
      setIsAddOpen(false);
      fetchDrivers();
    } catch (err: any) {
      toast.error(err.message || "Failed to save driver");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDriver = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove driver ${name}?`)) return;
    try {
      const res = await fetch(`/api/drivers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(`Driver ${name} removed.`);
      fetchDrivers();
    } catch {
      toast.error("Error removing driver.");
    }
  };

  const filteredDrivers = drivers.filter(
    (d) =>
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (d.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (d.phone ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (d.employeeCode ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = drivers.filter((d) => d.employmentStatus === "ACTIVE").length;
  const availableCount = drivers.filter((d) => d.availabilityStatus === "AVAILABLE").length;
  const drivingCount = drivers.filter((d) => d.availabilityStatus === "DRIVING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Driver Registry & Safety</h2>
          <p className="text-sm text-muted-foreground">Manage drivers, license verification, safety scores, and route availability.</p>
        </div>

        <Button size="sm" className="gap-1.5 font-semibold" onClick={handleOpenAdd}>
          <UserPlusIcon className="size-4" />
          <span>Register Driver</span>
        </Button>
      </div>

      {/* Add / Edit Driver Modal with LIVE PREVIEW */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingDriverId ? <PencilIcon className="size-4 text-primary" /> : <UserPlusIcon className="size-4 text-primary" />}
              <span>{editingDriverId ? "Edit Driver Details" : "Register New Driver"}</span>
            </DialogTitle>
            <DialogDescription>
              {editingDriverId ? "Modify driver details and preview changes live below." : "Add a driver to your organization with live editing preview."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
            {/* Form Column */}
            <form onSubmit={handleSaveDriver} id="driver-form" className="lg:col-span-7 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Michael Scott"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="driver@transitops.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Employee Code</label>
                <Input
                  placeholder="e.g. EMP-1042"
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Employment Status</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="ON_LEAVE">ON LEAVE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Availability Status</label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="DRIVING">DRIVING</option>
                    <option value="OFF_DUTY">OFF DUTY</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Emergency Contact</label>
                  <Input
                    placeholder="Jane Scott"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Emergency Phone</label>
                  <Input
                    placeholder="+1 (555) 019-9988"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
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
                    <SparklesIcon className="size-3.5 animate-pulse text-amber-500" /> Live Card Preview
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-background">
                    {editingDriverId ? "Editing Mode" : "New Driver"}
                  </Badge>
                </div>

                <div className="rounded-md border bg-card p-3 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {formData.fullName || "Driver Name"}
                      </h4>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {formData.employeeCode ? formData.employeeCode : "EMP-XXXX"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                      100/100
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MailIcon className="size-3 text-primary shrink-0" />
                      <span className="truncate">{formData.email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PhoneIcon className="size-3 text-primary shrink-0" />
                      <span>{formData.phone || "No phone provided"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t">
                    <Badge variant="outline" className="text-[10px]">
                      {formData.employmentStatus}
                    </Badge>
                    <Badge className="text-[10px] bg-primary/15 text-primary border-primary/30">
                      {formData.availabilityStatus}
                    </Badge>
                  </div>

                  {formData.emergencyContactName && (
                    <div className="text-[10px] bg-muted/50 rounded p-1.5 text-muted-foreground mt-1">
                      <span className="font-semibold text-foreground">ICE Contact:</span> {formData.emergencyContactName} ({formData.emergencyContactPhone || "N/A"})
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
            <Button type="submit" form="driver-form" disabled={submitting}>
              {submitting ? <Loader2Icon className="size-4 animate-spin mr-1" /> : null}
              {editingDriverId ? "Save Changes" : "Register Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Driver View Modal */}
      <Dialog open={Boolean(viewingDriver)} onOpenChange={(open) => !open && setViewingDriver(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="size-4 text-primary" />
              <span>Driver Profile Preview</span>
            </DialogTitle>
            <DialogDescription>Full record details for {viewingDriver?.fullName}</DialogDescription>
          </DialogHeader>

          {viewingDriver && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-base">{viewingDriver.fullName}</h3>
                  <p className="text-xs font-mono text-muted-foreground">{viewingDriver.employeeCode || "No Code"}</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                  Safety: {viewingDriver.currentSafetyScore || "100"}/100
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block font-medium">Email:</span>
                  <span className="font-semibold">{viewingDriver.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Phone:</span>
                  <span className="font-semibold">{viewingDriver.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Employment:</span>
                  <Badge variant="outline" className="mt-0.5">{viewingDriver.employmentStatus}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Availability:</span>
                  <Badge className="mt-0.5 bg-primary/15 text-primary">{viewingDriver.availabilityStatus}</Badge>
                </div>
              </div>

              {viewingDriver.emergencyContactName && (
                <div className="rounded-md border bg-muted/30 p-2 text-xs">
                  <span className="font-semibold block text-muted-foreground">Emergency Contact:</span>
                  <p className="font-medium text-foreground">{viewingDriver.emergencyContactName} - {viewingDriver.emergencyContactPhone || "No Phone"}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingDriver(null)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* KPI summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2Icon className="size-4" /> Active Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Compliant drivers</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <ShieldCheckIcon className="size-4" /> Available for Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{availableCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Off trip, ready to assign</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <AlertTriangleIcon className="size-4" /> On Route / Driving
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{drivingCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Currently assigned to trips</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center rounded-lg border bg-card p-3 shadow-xs max-w-sm">
        <SearchIcon className="size-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search name, phone, code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none text-xs focus-visible:ring-0"
        />
      </div>

      {/* Drivers Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Driver Name</TableHead>
              <TableHead className="text-xs font-bold">Code</TableHead>
              <TableHead className="text-xs font-bold">Phone & Email</TableHead>
              <TableHead className="text-xs font-bold">Safety Score</TableHead>
              <TableHead className="text-xs font-bold">Employment</TableHead>
              <TableHead className="text-xs font-bold">Availability</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin inline mr-2" /> Loading drivers...
                </TableCell>
              </TableRow>
            ) : filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => (
                <TableRow key={driver.id} className="hover:bg-muted/40 text-xs">
                  <TableCell className="font-semibold text-primary">{driver.fullName}</TableCell>
                  <TableCell className="font-mono text-[11px]">{driver.employeeCode || "—"}</TableCell>
                  <TableCell>
                    <div>{driver.phone || "—"}</div>
                    <div className="text-[10px] text-muted-foreground">{driver.email || ""}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      {driver.currentSafetyScore ? `${driver.currentSafetyScore}/100` : "100/100"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {driver.employmentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {driver.availabilityStatus === "AVAILABLE" && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                        AVAILABLE
                      </Badge>
                    )}
                    {driver.availabilityStatus === "DRIVING" && (
                      <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30">
                        DRIVING
                      </Badge>
                    )}
                    {driver.availabilityStatus !== "AVAILABLE" && driver.availabilityStatus !== "DRIVING" && (
                      <Badge variant="secondary" className="text-[10px]">
                        {driver.availabilityStatus}
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
                        onClick={() => setViewingDriver(driver)}
                      >
                        <EyeIcon className="size-3.5" />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Edit Driver"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleOpenEdit(driver)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Delete Driver"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteDriver(driver.id, driver.fullName)}
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
