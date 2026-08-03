import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellIcon, AlertTriangleIcon, WrenchIcon, CheckCircle2Icon, NavigationIcon } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Notifications & Dispatch Alerts</h2>
          <p className="text-sm text-muted-foreground">In-app notifications, route delays, maintenance reminders, and security alerts.</p>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Mark All as Read
        </Button>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Notification History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <AlertTriangleIcon className="size-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-700 dark:text-rose-400">Compliance Warning: License Expiration</p>
              <p className="text-muted-foreground mt-0.5">David Miller's commercial driver license expires in 3 days. Action required.</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">10 minutes ago</span>
            </div>
            <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-200">
              UNREAD
            </Badge>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <WrenchIcon className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-700 dark:text-amber-400">Maintenance Work Order Created</p>
              <p className="text-muted-foreground mt-0.5">Work order #WO-9081 assigned for TRK-7711 (Scania R500).</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">1 hour ago</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <NavigationIcon className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-blue-700 dark:text-blue-400">Trip Dispatched Successfully</p>
              <p className="text-muted-foreground mt-0.5">Trip #TRIP-8891 (Chicago to Detroit) is now IN_PROGRESS.</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">3 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
