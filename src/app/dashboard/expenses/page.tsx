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
import { ReceiptIcon, PlusIcon, DollarSignIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";

const mockExpenses = [
  {
    id: "exp-601",
    expenseNumber: "EXP-1092",
    category: "TOLL_FEE",
    amount: "$85.00",
    vendor: "Illinois Tollway",
    date: "2026-08-02",
    submittedBy: "Alexander Wright",
    status: "APPROVED",
  },
  {
    id: "exp-602",
    expenseNumber: "EXP-1093",
    category: "DRIVER_ALLOWANCE",
    amount: "$150.00",
    vendor: "Per Diem Allowance",
    date: "2026-08-03",
    submittedBy: "Sarah Jenkins",
    status: "SUBMITTED",
  },
  {
    id: "exp-603",
    expenseNumber: "EXP-1094",
    category: "PARKING",
    amount: "$45.00",
    vendor: "Chicago Hub Terminal",
    date: "2026-08-03",
    submittedBy: "Marcus Vance",
    status: "PAID",
  },
];

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Expenses & Claims</h2>
          <p className="text-sm text-muted-foreground">Track driver expense claims, toll receipts, maintenance costs, and approval workflows.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <PlusIcon className="size-4" />
          <span>File Expense Claim</span>
        </Button>
      </div>

      {/* Expense KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4 Claims</p>
            <p className="text-xs text-muted-foreground mt-0.5">$640.00 awaiting review</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Approved This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$12,450.00</p>
            <p className="text-xs text-muted-foreground mt-0.5">38 Approved claims</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-purple-600 dark:text-purple-400">Total YTD Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$148,200.00</p>
            <p className="text-xs text-muted-foreground mt-0.5">Within annual budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Expense #</TableHead>
              <TableHead className="text-xs font-bold">Category</TableHead>
              <TableHead className="text-xs font-bold">Vendor</TableHead>
              <TableHead className="text-xs font-bold">Submitted By</TableHead>
              <TableHead className="text-xs font-bold">Date</TableHead>
              <TableHead className="text-xs font-bold">Amount</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExpenses.map((exp) => (
              <TableRow key={exp.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-semibold text-primary">{exp.expenseNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {exp.category}
                  </Badge>
                </TableCell>
                <TableCell>{exp.vendor}</TableCell>
                <TableCell>{exp.submittedBy}</TableCell>
                <TableCell>{exp.date}</TableCell>
                <TableCell className="font-bold">{exp.amount}</TableCell>
                <TableCell>
                  {exp.status === "SUBMITTED" && (
                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                      SUBMITTED
                    </Badge>
                  )}
                  {exp.status === "APPROVED" && (
                    <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
                      APPROVED
                    </Badge>
                  )}
                  {exp.status === "PAID" && (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                      PAID
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
