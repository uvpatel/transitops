import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No records found",
  description = "There are currently no items in this section.",
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed p-8 text-center shadow-xs">
      <CardContent className="flex flex-col items-center justify-center p-0 space-y-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon || <InboxIcon className="size-6" />}
        </div>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>
        </div>
        {actionText && onAction && (
          <Button size="sm" onClick={onAction} className="mt-2 font-semibold">
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
