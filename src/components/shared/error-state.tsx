import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this page. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="border-rose-500/20 bg-rose-500/5 p-8 text-center shadow-xs">
      <CardContent className="flex flex-col items-center justify-center p-0 space-y-3 text-rose-700 dark:text-rose-400">
        <div className="flex size-12 items-center justify-center rounded-full bg-rose-500/10">
          <AlertTriangleIcon className="size-6 text-rose-600" />
        </div>
        <div>
          <h3 className="text-base font-bold">{title}</h3>
          <p className="text-xs opacity-90 mt-1 max-w-sm mx-auto">{description}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 font-semibold border-rose-300">
            <RefreshCwIcon className="size-3.5" />
            <span>Try Again</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
