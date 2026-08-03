import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPinIcon,
  NavigationIcon,
  TruckIcon,
  UserCheckIcon,
  SearchIcon,
  RadioIcon,
  LayersIcon,
  CompassIcon,
} from "lucide-react";

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Live Dispatch Control Board</h2>
            <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 animate-pulse">
              <RadioIcon className="size-3 mr-1 inline" /> LIVE FEED
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Monitor real-time GPS telemetry, active trip routes, and dispatch available drivers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
            <LayersIcon className="size-3.5" />
            <span>Map Layers</span>
          </Button>
          <Button size="sm" className="gap-1.5 font-semibold">
            <NavigationIcon className="size-4" />
            <span>Dispatch New Route</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Live Map Canvas & Dispatch Stream */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Live GPS Map Simulation Canvas (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="shadow-xs overflow-hidden h-[500px] flex flex-col relative border-primary/20">
            <CardHeader className="py-3 bg-muted/40 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CompassIcon className="size-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Regional Telemetry Map (Simulated GPS)</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px]">
                14 Active Signals
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-slate-950/90 dark:bg-black flex items-center justify-center text-slate-400">
              {/* Simulated Map Visual Layer */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Map Nodes Simulation */}
              <div className="relative z-10 flex flex-col items-center space-y-4 text-center p-6">
                <div className="size-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-ping absolute" />
                <div className="size-16 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center relative shadow-lg">
                  <TruckIcon className="size-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-base">GPS Telemetry Stream Active</p>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Real-time coordinates updated every 5s across active delivery corridors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dispatch Operations Queue */}
        <div className="space-y-4">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Active Dispatch Pipeline</CardTitle>
              <CardDescription className="text-xs">Trips scheduled for dispatch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-card border shadow-2xs space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-primary">TRIP-8891</span>
                  <Badge variant="outline" className="text-amber-600 bg-amber-50">
                    READY FOR DISPATCH
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">Chicago Hub → Detroit Distribution</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t">
                  <span>Driver: Marcus Vance</span>
                  <span>Vehicle: TRK-9081</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-card border shadow-2xs space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-primary">TRIP-8894</span>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50">
                    IN TRANSIT
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">Dallas Depot → Houston Hub</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t">
                  <span>Driver: Sarah Jenkins</span>
                  <span>Vehicle: VAN-4022</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
