import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheckIcon, AlertTriangleIcon, FileTextIcon, CheckCircle2Icon } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Compliance & Safety Audits</h2>
          <p className="text-sm text-muted-foreground">Monitor driver commercial license validity, vehicle fitness permits, and insurance renewals.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <ShieldCheckIcon className="size-4" />
          <span>Run Compliance Audit</span>
        </Button>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-xs bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Fleet Compliance Index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">98.2%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Compliant across all regulations</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-amber-600 dark:text-amber-400">Permits Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3 Documents</p>
            <p className="text-xs text-muted-foreground mt-0.5">Expires within 30 days</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-rose-500/5 border-rose-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-rose-600 dark:text-rose-400">Immediate Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-rose-600">1 License</p>
            <p className="text-xs text-muted-foreground mt-0.5">David Miller (DL-88219401)</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Compliance Warnings */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Active Compliance Warnings & Renewal Queue</CardTitle>
          <CardDescription className="text-xs">Driver and vehicle document expiration alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400">
            <div className="flex items-center gap-3">
              <AlertTriangleIcon className="size-5 shrink-0" />
              <div>
                <p className="font-bold">Driver License Expiring in 3 Days</p>
                <p className="text-[11px] opacity-90">David Miller • License #DL-88219401 • Expires Aug 06, 2026</p>
              </div>
            </div>
            <Button size="xs" variant="destructive" className="h-7">
              Renew License
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
            <div className="flex items-center gap-3">
              <FileTextIcon className="size-5 shrink-0" />
              <div>
                <p className="font-bold">Vehicle Road Fitness Permit Renewal</p>
                <p className="text-[11px] opacity-90">TRK-7711 (Scania R500) • Permit #PER-99182 • Expires Aug 24, 2026</p>
              </div>
            </div>
            <Button size="xs" variant="outline" className="h-7 text-amber-700 border-amber-300">
              Review Permit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
