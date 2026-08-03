import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3Icon,
  TrendingUpIcon,
  DownloadIcon,
  FuelIcon,
  DollarSignIcon,
  TruckIcon,
  CalendarIcon,
} from "lucide-react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Fleet Analytics & Intelligence</h2>
          <p className="text-sm text-muted-foreground">Comprehensive insights into vehicle utilization, fuel economy, and operational expenditures.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
            <CalendarIcon className="size-3.5" />
            <span>Last 30 Days</span>
          </Button>
          <Button size="sm" className="gap-1.5 text-xs font-semibold">
            <DownloadIcon className="size-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Avg Utilization Rate</CardDescription>
            <CardTitle className="text-2xl font-bold">84.2%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
              <TrendingUpIcon className="size-3 mr-1 inline" /> +4.2%
            </Badge>
            <span>vs previous month</span>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Avg Cost per Km</CardDescription>
            <CardTitle className="text-2xl font-bold">$0.48 / km</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
              <TrendingUpIcon className="size-3 mr-1 inline" /> -3.1%
            </Badge>
            <span>optimized routes</span>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Fuel Consumed</CardDescription>
            <CardTitle className="text-2xl font-bold">14,280 L</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
              <FuelIcon className="size-3 mr-1 inline" /> 3.8 km/L
            </Badge>
            <span>fleet average</span>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Expenses</CardDescription>
            <CardTitle className="text-2xl font-bold">$38,450.00</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">
              <DollarSignIcon className="size-3 mr-1 inline" /> Budget OK
            </Badge>
            <span>92% of target</span>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="utilization" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="utilization" className="text-xs">Fleet Utilization</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs">Expense Breakdown</TabsTrigger>
          <TabsTrigger value="efficiency" className="text-xs">Fuel & Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="space-y-4">
          <ChartAreaInteractive />
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="p-6 text-center text-muted-foreground">
            <BarChart3Icon className="mx-auto size-10 mb-2 text-primary" />
            <p className="font-semibold text-foreground">Expense Analysis Breakdown</p>
            <p className="text-xs mt-1">Detailed operational expense category distribution (Fuel 45%, Maintenance 30%, Tolls & Allowances 25%).</p>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency">
          <Card className="p-6 text-center text-muted-foreground">
            <FuelIcon className="mx-auto size-10 mb-2 text-emerald-500" />
            <p className="font-semibold text-foreground">Fuel Efficiency & Emission Metrics</p>
            <p className="text-xs mt-1">Comparing vehicle fuel consumption per 100km across diesel, petrol, and hybrid fleets.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
