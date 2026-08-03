import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlertIcon, ArrowLeftIcon } from "lucide-react";

export function UnauthorizedState({
  title = "403 - Access Denied",
  description = "You do not have the required permissions or role to view this page.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-amber-500/30">
        <CardContent className="flex flex-col items-center justify-center p-0 space-y-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <ShieldAlertIcon className="size-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
          </div>
          <Button  size="sm" className="gap-2 font-semibold mt-2">
            <Link href="/dashboard">
              <ArrowLeftIcon className="size-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
