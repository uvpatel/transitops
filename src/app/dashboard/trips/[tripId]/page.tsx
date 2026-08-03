import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeftIcon,
  NavigationIcon,
  MapPinIcon,
  CheckCircle2Icon,
  ClockIcon,
  TruckIcon,
  UserCheckIcon,
  PackageIcon,
} from "lucide-react";

export default function TripDetailPage({ params }: { params: { tripId: string } }) {
  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div className="flex items-center gap-3">
        <Button  variant="outline" size="icon" className="size-8">
          <Link href="/dashboard/trips">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">TRIP-8891: Chicago to Detroit Cargo</h2>
            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">
              IN PROGRESS
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">High Priority Delivery • Distance: 450 km • Cargo Weight: 18,500 kg</p>
        </div>
      </div>

      {/* Assignment Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <TruckIcon className="size-4 text-emerald-500" /> Assigned Vehicle
          </div>
          <p className="text-base font-bold mt-1">TRK-9081 (Volvo FH16)</p>
          <p className="text-[10px] text-muted-foreground">Heavy Truck • Diesel</p>
        </Card>
        <Card className="p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <UserCheckIcon className="size-4 text-purple-500" /> Assigned Driver
          </div>
          <p className="text-base font-bold mt-1">Alexander Wright</p>
          <p className="text-[10px] text-emerald-600 font-medium">Safety Score: 98.5 / 100</p>
        </Card>
        <Card className="p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <PackageIcon className="size-4 text-amber-500" /> Customer Manifest
          </div>
          <p className="text-base font-bold mt-1">Apex Auto Components</p>
          <p className="text-[10px] text-muted-foreground">Contact: +1 (555) 892-1029</p>
        </Card>
      </div>

      {/* Multi-Stop Timeline */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Route Stop Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 border-l-2 border-emerald-500 pl-4 py-1">
            <CheckCircle2Icon className="size-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Stop 1: Origin Pickup (Chicago Depot)</p>
              <p className="text-[11px] text-muted-foreground">Completed at 08:15 AM • 18,500 kg loaded</p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-l-2 border-blue-500 pl-4 py-1">
            <ClockIcon className="size-5 text-blue-500 shrink-0 mt-0.5 animate-spin" />
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Stop 2: Toledo Checkpoint & Fuel Stop</p>
              <p className="text-[11px] text-muted-foreground">En Route • Estimated Arrival: 11:45 AM</p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-l-2 border-muted pl-4 py-1">
            <MapPinIcon className="size-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Stop 3: Final Destination Delivery (Detroit Hub)</p>
              <p className="text-[11px] text-muted-foreground">Scheduled Arrival: 02:30 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
