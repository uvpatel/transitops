import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendType = "positive",
  className,
}: StatCardProps) {
  return (
    <Card className={`shadow-xs transition-shadow hover:shadow-md ${className || ""}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            {trend && (
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 font-semibold ${
                  trendType === "positive"
                    ? "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40"
                    : trendType === "negative"
                    ? "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40"
                    : "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40"
                }`}
              >
                {trend}
              </Badge>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
