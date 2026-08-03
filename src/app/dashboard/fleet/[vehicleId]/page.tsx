import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeftIcon,
  TruckIcon,
  WrenchIcon,
  FuelIcon,
  FileTextIcon,
  NavigationIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from "lucide-react";

export default function VehicleDetailPage({ params }: { params: { vehicleId: string } }) {
  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <Button  variant="outline" size="icon" className="size-8">
          <Link href="/dashboard/fleet">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">TRK-9081 (Volvo FH16)</h2>
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
              AVAILABLE
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">VIN: 1YVHZ881023901923 • Organization: TransitOps Global</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Cargo Capacity</p>
          <p className="text-lg font-bold mt-1">25,000 kg</p>
          <p className="text-[10px] text-muted-foreground">42 m³ volume</p>
        </Card>
        <Card className="p-4 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Odometer</p>
          <p className="text-lg font-bold mt-1">142,500 km</p>
          <p className="text-[10px] text-muted-foreground">Next service at 150,000 km</p>
        </Card>
        <Card className="p-4 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Fuel Efficiency</p>
          <p className="text-lg font-bold mt-1">3.4 km / L</p>
          <p className="text-[10px] text-muted-foreground">Diesel Heavy Duty</p>
        </Card>
        <Card className="p-4 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Insurance Expiry</p>
          <p className="text-lg font-bold mt-1 text-emerald-600">Nov 15, 2026</p>
          <p className="text-[10px] text-muted-foreground">Coverage Verified</p>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="overview" className="text-xs">Specifications</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs">Service History</TabsTrigger>
          <TabsTrigger value="fuel" className="text-xs">Fuel Logs</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Documents & Permits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Technical Specifications</CardTitle>
              <CardDescription className="text-xs">Manufacturer details and operational thresholds</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
              <div>
                <span className="text-muted-foreground">Make:</span>
                <p className="font-semibold text-sm">Volvo</p>
              </div>
              <div>
                <span className="text-muted-foreground">Model:</span>
                <p className="font-semibold text-sm">FH16 Heavy</p>
              </div>
              <div>
                <span className="text-muted-foreground">Manufacturing Year:</span>
                <p className="font-semibold text-sm">2023</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fuel Type:</span>
                <p className="font-semibold text-sm">Diesel</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="p-6 text-center text-muted-foreground shadow-xs">
            <WrenchIcon className="mx-auto size-8 text-muted-foreground mb-2" />
            <p className="font-semibold text-foreground">Maintenance History</p>
            <p className="text-xs mt-1">Last service completed on June 12, 2026 (Oil Change & Brake Inspection).</p>
          </Card>
        </TabsContent>

        <TabsContent value="fuel">
          <Card className="p-6 text-center text-muted-foreground shadow-xs">
            <FuelIcon className="mx-auto size-8 text-muted-foreground mb-2" />
            <p className="font-semibold text-foreground">Fuel Log Ledger</p>
            <p className="text-xs mt-1">Recent fuel fill-up: 450 Liters @ $1.42/L on July 28, 2026.</p>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6 text-center text-muted-foreground shadow-xs">
            <ShieldCheckIcon className="mx-auto size-8 text-emerald-500 mb-2" />
            <p className="font-semibold text-foreground">Compliance Documents</p>
            <p className="text-xs mt-1">Registration Certificate, Fitness Permit, and Pollution Compliance are active.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
