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
import { HistoryIcon, ShieldCheckIcon, DownloadIcon } from "lucide-react";

const mockAuditLogs = [
  {
    id: "audit-1",
    action: "START_TRIP",
    entity: "Trip #TRIP-8891",
    user: "Alexander Wright (Driver)",
    ip: "192.168.1.104",
    timestamp: "2026-08-03 08:15:02",
  },
  {
    id: "audit-2",
    action: "ASSIGN_DRIVER",
    entity: "Vehicle TRK-9081",
    user: "Sarah Jenkins (Dispatcher)",
    ip: "192.168.1.42",
    timestamp: "2026-08-03 07:45:18",
  },
  {
    id: "audit-3",
    action: "CREATE_WORK_ORDER",
    entity: "Work Order #WO-9081",
    user: "Alex Wright (Fleet Manager)",
    ip: "192.168.1.12",
    timestamp: "2026-08-02 16:30:00",
  },
  {
    id: "audit-4",
    action: "APPROVE_EXPENSE",
    entity: "Expense #EXP-1092",
    user: "Urvil Patel (Admin)",
    ip: "192.168.1.01",
    timestamp: "2026-08-02 14:10:22",
  },
];

export default function AuditPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Security Audit & Activity Logs</h2>
          <p className="text-sm text-muted-foreground">Tamper-evident audit trail tracking entity modifications, trip dispatches, and user actions.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
          <DownloadIcon className="size-3.5" />
          <span>Export Audit Log</span>
        </Button>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">Timestamp</TableHead>
              <TableHead className="text-xs font-bold">Action</TableHead>
              <TableHead className="text-xs font-bold">Target Entity</TableHead>
              <TableHead className="text-xs font-bold">Performed By</TableHead>
              <TableHead className="text-xs font-bold">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-mono text-muted-foreground">{log.timestamp}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-bold text-[10px]">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary">{log.entity}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{log.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
