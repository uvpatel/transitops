import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/shared/role-badge";
import { ShieldIcon, PlusIcon, LockIcon } from "lucide-react";

const mockRoles = [
  {
    role: "ADMIN",
    title: "System Administrator",
    description: "Full read & write access across all transport management modules, settings, and billing.",
    permissionCount: 38,
    isSystem: true,
  },
  {
    role: "FLEET_MANAGER",
    title: "Fleet Operations Manager",
    description: "Vehicle inventory, driver assignments, work orders, and fuel logs.",
    permissionCount: 22,
    isSystem: true,
  },
  {
    role: "DISPATCHER",
    title: "Trip Dispatcher",
    description: "Live map control, trip creation, driver route assignments, and trip status updates.",
    permissionCount: 12,
    isSystem: true,
  },
  {
    role: "DRIVER",
    title: "Commercial Driver",
    description: "Personal assigned trips, fuel logging, and expense claim filing.",
    permissionCount: 6,
    isSystem: true,
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Roles & System Permissions</h2>
          <p className="text-sm text-muted-foreground">Configure permission scopes and role-based access control (RBAC) rules.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <PlusIcon className="size-4" />
          <span>Create Custom Role</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mockRoles.map((r) => (
          <Card key={r.role} className="shadow-xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <RoleBadge role={r.role} />
                {r.isSystem && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    <LockIcon className="size-3 mr-1 inline" /> System Role
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-bold mt-2">{r.title}</CardTitle>
              <CardDescription className="text-xs">{r.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">{r.permissionCount} Permissions Granted</span>
              <Button size="xs" variant="ghost">
                View Matrix
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
