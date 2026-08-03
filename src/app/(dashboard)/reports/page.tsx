import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheetIcon, DownloadIcon, ArrowUpRightIcon, BarChart3Icon, FuelIcon, DollarSignIcon, ShieldCheckIcon } from "lucide-react";

const mockReports = [
  {
    id: "rep-1",
    title: "Fleet Utilization & Mileage Report",
    category: "OPERATIONS",
    description: "Vehicle run-time hours, odometer progression, and idle duration metrics.",
    href: "/reports/fleet-utilization",
  },
  {
    id: "rep-2",
    title: "Trip Delivery Performance Summary",
    category: "LOGISTICS",
    description: "On-time arrival compliance, route delays, and stop duration breakdown.",
    href: "/reports/trip-performance",
  },
  {
    id: "rep-3",
    title: "Fuel Consumption & Cost Per Km",
    category: "FINANCIAL",
    description: "Monthly fuel spend, km/L efficiency by vehicle model, and station ledger.",
    href: "/reports/fuel-consumption",
  },
  {
    id: "rep-4",
    title: "Compliance & Driver Licensing Audit",
    category: "SAFETY",
    description: "Driver commercial license validity, fitness permit status, and insurance expirations.",
    href: "/reports/compliance",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Executive Fleet Reports</h2>
          <p className="text-sm text-muted-foreground">Exportable PDF and CSV reports for fleet management, finance, and regulatory compliance.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <DownloadIcon className="size-4" />
          <span>Export All Reports (ZIP)</span>
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mockReports.map((report) => (
          <Card key={report.id} className="shadow-xs hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {report.category}
                </Badge>
                <FileSpreadsheetIcon className="size-4 text-primary" />
              </div>
              <CardTitle className="text-base font-bold mt-2">{report.title}</CardTitle>
              <CardDescription className="text-xs">{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 flex justify-end">
              <Button  size="xs" variant="ghost" className="h-7 px-2 font-semibold">
                <Link href={report.href}>
                  Generate Report <ArrowUpRightIcon className="size-3.5 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
