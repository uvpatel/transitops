import * as React from "react";
import { Badge } from "@/components/ui/badge";

type StatusType =
  | "AVAILABLE"
  | "IN_TRANSIT"
  | "MAINTENANCE"
  | "ACTIVE"
  | "COMPLETED"
  | "SCHEDULED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "WARNING"
  | string;

export function StatusBadge({ status }: { status: StatusType }) {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "AVAILABLE":
    case "ACTIVE":
    case "COMPLETED":
    case "APPROVED":
    case "PAID":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
          {status}
        </Badge>
      );
    case "IN_TRANSIT":
    case "IN_PROGRESS":
    case "SCHEDULED":
    case "DRIVING":
      return (
        <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20">
          {status}
        </Badge>
      );
    case "MAINTENANCE":
    case "PENDING":
    case "SUBMITTED":
    case "HIGH":
    case "WARNING":
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
          {status}
        </Badge>
      );
    case "EXPIRED":
    case "REJECTED":
    case "URGENT":
    case "OVERDUE":
    case "SUSPENDED":
      return (
        <Badge variant="destructive" className="font-semibold">
          {status}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          {status}
        </Badge>
      );
  }
}
