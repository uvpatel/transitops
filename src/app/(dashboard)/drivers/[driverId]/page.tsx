import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeftIcon,
  UserCheckIcon,
  ShieldCheckIcon,
  StarIcon,
  NavigationIcon,
  FileTextIcon,
  PhoneIcon,
  MailIcon,
  AwardIcon,
} from "lucide-react";

export default function DriverDetailPage({ params }: { params: { driverId: string } }) {
  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <Button  variant="outline" size="icon" className="size-8">
          <Link href="/dashboard/drivers">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Alexander Wright</h2>
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
              AVAILABLE
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Employee Code: DRV-1029 • Commercial Heavy License</p>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Safety Score</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
            98.5 <StarIcon className="size-5 text-amber-500 fill-amber-500" />
          </p>
          <p className="text-[10px] text-muted-foreground">Top 5% in Organization</p>
        </Card>
        <Card className="p-4 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Total Distance Driven</p>
          <p className="text-lg font-bold mt-1">42,850 km</p>
          <p className="text-[10px] text-muted-foreground">Across 128 trips</p>
        </Card>
        <Card className="p-4 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">License Expiry</p>
          <p className="text-lg font-bold mt-1">Apr 12, 2027</p>
          <p className="text-[10px] text-emerald-600 font-medium">Verified Active</p>
        </Card>
        <Card className="p-4 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Emergency Contact</p>
          <p className="text-sm font-bold mt-1">Jane Wright</p>
          <p className="text-[10px] text-muted-foreground">+1 (555) 019-2834</p>
        </Card>
      </div>

      {/* Driver Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="profile" className="text-xs">Personal Info</TabsTrigger>
          <TabsTrigger value="trips" className="text-xs">Assigned Trips</TabsTrigger>
          <TabsTrigger value="safety" className="text-xs">Safety Audit</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Licenses & Records</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Contact & Employment Record</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-semibold text-sm">alexander.w@transitops.com</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-semibold text-sm">+1 (555) 392-1029</p>
              </div>
              <div>
                <span className="text-muted-foreground">Joining Date:</span>
                <p className="font-semibold text-sm">Jan 15, 2022</p>
              </div>
              <div>
                <span className="text-muted-foreground">Employment Status:</span>
                <p className="font-semibold text-sm text-emerald-600">Active Full-Time</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips">
          <Card className="p-6 text-center text-muted-foreground shadow-xs">
            <NavigationIcon className="mx-auto size-8 text-blue-500 mb-2" />
            <p className="font-semibold text-foreground">Completed & Active Trips</p>
            <p className="text-xs mt-1">128 Completed trips with 99.4% on-time delivery compliance.</p>
          </Card>
        </TabsContent>

        <TabsContent value="safety">
          <Card className="p-6 text-center text-muted-foreground shadow-xs">
            <AwardIcon className="mx-auto size-8 text-amber-500 mb-2" />
            <p className="font-semibold text-foreground">Driver Telematics Safety Scorecard</p>
            <p className="text-xs mt-1">Zero harsh braking events or speeding penalties logged in past 90 days.</p>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6 text-center text-muted-foreground shadow-xs">
            <ShieldCheckIcon className="mx-auto size-8 text-emerald-500 mb-2" />
            <p className="font-semibold text-foreground">Driver Documents & Medical Certification</p>
            <p className="text-xs mt-1">Commercial Driver License (Class A) & Medical Examiner Certificate verified.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
