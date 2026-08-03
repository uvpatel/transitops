import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2Icon, CheckCircle2Icon, UsersIcon, TruckIcon, GlobeIcon } from "lucide-react";

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Organization Profile & Billing</h2>
          <p className="text-sm text-muted-foreground">Manage company details, transport license code, timezone, and subscription tier.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <Building2Icon className="size-4" />
          <span>Edit Profile</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="shadow-xs md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">TransitOps Global Logistics</CardTitle>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                ACTIVE MULTI-TENANT
              </Badge>
            </div>
            <CardDescription className="text-xs">Organization Code: TRANSITOPS-US-01</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Contact Email:</span>
              <p className="font-semibold text-sm">support@transitops.com</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phone Number:</span>
              <p className="font-semibold text-sm">+1 (800) 555-0192</p>
            </div>
            <div>
              <span className="text-muted-foreground">Default Timezone:</span>
              <p className="font-semibold text-sm">UTC - America/Chicago</p>
            </div>
            <div>
              <span className="text-muted-foreground">Operating Currency:</span>
              <p className="font-semibold text-sm">USD ($)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Subscription Plan</CardTitle>
            <CardDescription className="text-xs">Enterprise Fleet Tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Vehicles:</span>
              <span className="font-bold">45 / 100 Allowed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Member Accounts:</span>
              <span className="font-bold">12 / 50 Users</span>
            </div>
            <div className="pt-2 border-t flex justify-end">
              <Button size="xs" variant="outline">Upgrade Subscription</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
