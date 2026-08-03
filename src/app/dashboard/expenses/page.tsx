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
  ReceiptIcon,
  PlusIcon,
  SearchIcon,
  DollarSignIcon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";

interface Expense {
  id: string;
  expenseNumber: string;
  amount: string;
  currency: string;
  expenseDate: string;
  vendorName?: string | null;
  description: string;
  status: string;
  vehicle?: { id: string; registrationNumber: string } | null;
  driver?: { id: string; fullName: string } | null;
}

interface Vehicle {
  id: string;
  registrationNumber: string;
}

interface Driver {
  id: string;
  fullName: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    amount: "",
    vendorName: "",
    description: "",
    expenseDate: new Date().toISOString().slice(0, 10),
    vehicleId: "",
    driverId: "",
  });

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [expRes, vRes, dRes] = await Promise.all([
        fetch("/api/expenses").then((r) => r.json()),
        fetch("/api/vehicle").then((r) => r.json()),
        fetch("/api/drivers").then((r) => r.json()),
      ]);

      setExpenses(expRes.expenses || []);
      setVehicles(vRes.vehicles || []);
      setDrivers(dRes.drivers || []);
    } catch {
      toast.error("Failed to load expenses data.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      toast.error("Amount and description are required");
      return;
    }

    if (Number(formData.amount) < 0) {
      toast.error("Expense amount cannot be negative");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to file expense");

      toast.success(`Expense filed successfully! (${data.expense?.expenseNumber || ""})`);
      setIsAddOpen(false);
      setFormData({
        amount: "",
        vendorName: "",
        description: "",
        expenseDate: new Date().toISOString().slice(0, 10),
        vehicleId: "",
        driverId: "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to file expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string, expNum: string) => {
    if (!confirm(`Are you sure you want to delete expense ${expNum}?`)) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(`Expense ${expNum} deleted.`);
      fetchData();
    } catch {
      toast.error("Error deleting expense.");
    }
  };

  const filteredExpenses = expenses.filter(
    (e) =>
      e.expenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      (e.vendorName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Financial Expenses & Claims</h2>
          <p className="text-sm text-muted-foreground">Log operational costs, toll charges, driver allowances, and vendor invoices.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button size="sm" className="gap-1.5 font-semibold" />}>
            <PlusIcon className="size-4" />
            <span>File New Expense</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>File Operational Expense</DialogTitle>
              <DialogDescription>Submit a new cost claim for vehicle or driver reimbursement.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFileExpense} className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Amount ($) *</label>
                  <Input
                    required
                    type="number"
                    min="0"
                    placeholder="120.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Expense Date *</label>
                  <Input
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Vendor / Merchant Name</label>
                <Input
                  placeholder="Highway Toll Plaza, Shell Gas..."
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Description *</label>
                <Input
                  required
                  placeholder="Interstate toll receipt & parking..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Related Vehicle</label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="">-- None --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Related Driver</label>
                  <select
                    value={formData.driverId}
                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="">-- None --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2Icon className="size-4 animate-spin mr-1" /> : null}
                  File Expense
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Card */}
      <Card className="shadow-xs bg-amber-500/5 border-amber-500/20 max-w-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <DollarSignIcon className="size-4" /> Total Expenses Logged
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{expenses.length} claims submitted</p>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center rounded-lg border bg-card p-3 shadow-xs max-w-sm">
        <SearchIcon className="size-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search expense #, description, vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none text-xs focus-visible:ring-0"
        />
      </div>

      {/* Expenses Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Expense #</TableHead>
              <TableHead className="text-xs font-bold">Description & Vendor</TableHead>
              <TableHead className="text-xs font-bold">Vehicle / Driver</TableHead>
              <TableHead className="text-xs font-bold">Date</TableHead>
              <TableHead className="text-xs font-bold">Amount</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin inline mr-2" /> Loading expenses...
                </TableCell>
              </TableRow>
            ) : filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  No expense records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((exp) => (
                <TableRow key={exp.id} className="hover:bg-muted/40 text-xs">
                  <TableCell className="font-semibold text-primary font-mono">{exp.expenseNumber}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{exp.description}</div>
                    <div className="text-[10px] text-muted-foreground">{exp.vendorName || "General Vendor"}</div>
                  </TableCell>
                  <TableCell>
                    <div>{exp.vehicle?.registrationNumber || "—"}</div>
                    <div className="text-[10px] text-muted-foreground">{exp.driver?.fullName || ""}</div>
                  </TableCell>
                  <TableCell>{exp.expenseDate || "—"}</TableCell>
                  <TableCell className="font-bold text-amber-600 dark:text-amber-400">
                    ${Number(exp.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {exp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteExpense(exp.id, exp.expenseNumber)}
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
