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
}

export default function DriversPage() {
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
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

  const handleRegisterDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) {
      toast.error("Full name is required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register driver");

      toast.success(`Driver ${formData.fullName} registered successfully!`);
      setIsAddOpen(false);
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
      fetchDrivers();
    } catch (err: any) {
      toast.error(err.message || "Failed to register driver");
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

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-1.5 font-semibold" />}>
            <UserPlusIcon className="size-4" />
            <span>Register Driver</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Driver</DialogTitle>
              <DialogDescription>Add a driver to your organization for dispatch & safety tracking.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegisterDriver} className="space-y-3 py-2">
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
                  <label className="text-xs font-semibold text-muted-foreground">Emergency Contact Name</label>
                  <Input
                    placeholder="Jane Scott"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Emergency Contact Phone</label>
                  <Input
                    placeholder="+1 (555) 019-9988"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
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
                  Save Driver
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteDriver(driver.id, driver.fullName)}
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
