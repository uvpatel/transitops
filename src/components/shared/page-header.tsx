import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description?: string;
  badgeText?: string;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badgeText,
  badgeVariant = "outline",
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
          {badgeText && (
            <Badge variant={badgeVariant} className="text-[10px] font-semibold">
              {badgeText}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
