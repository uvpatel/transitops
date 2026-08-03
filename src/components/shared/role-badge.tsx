import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { AppRole } from "@/types/auth";
import { ShieldIcon, UserCheckIcon, WrenchIcon, NavigationIcon, DollarSignIcon, ShieldAlertIcon } from "lucide-react";

export function RoleBadge({ role }: { role: AppRole | string }) {
  const normalized = role.toUpperCase();

  switch (normalized) {
    case "ADMIN":
      return (
        <Badge variant="outline" className="font-bold text-[10px] text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/40">
          <ShieldIcon className="size-3 mr-1 inline" /> ADMIN
        </Badge>
      );
    case "FLEET_MANAGER":
      return (
        <Badge variant="outline" className="font-bold text-[10px] text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40">
          <WrenchIcon className="size-3 mr-1 inline" /> FLEET MANAGER
        </Badge>
      );
    case "DISPATCHER":
      return (
        <Badge variant="outline" className="font-bold text-[10px] text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40">
          <NavigationIcon className="size-3 mr-1 inline" /> DISPATCHER
        </Badge>
      );
    case "DRIVER":
      return (
        <Badge variant="outline" className="font-bold text-[10px] text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-900">
          <UserCheckIcon className="size-3 mr-1 inline" /> DRIVER
        </Badge>
      );
    case "SAFETY_OFFICER":
      return (
        <Badge variant="outline" className="font-bold text-[10px] text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40">
          <ShieldAlertIcon className="size-3 mr-1 inline" /> SAFETY OFFICER
        </Badge>
      );
    case "FINANCIAL_ANALYST":
      return (
        <Badge variant="outline" className="font-bold text-[10px] text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40">
          <DollarSignIcon className="size-3 mr-1 inline" /> FINANCIAL ANALYST
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-[10px]">
          {role}
        </Badge>
      );
  }
}
