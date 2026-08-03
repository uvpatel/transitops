import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="p-6 border border-rose-500/30 bg-rose-500/5 shadow-lg text-center">
          <CardContent className="p-0 space-y-4 text-rose-700 dark:text-rose-400">
            <div className="flex size-14 items-center justify-center rounded-full bg-rose-500/10 mx-auto">
              <AlertTriangleIcon className="size-8 text-rose-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Authentication Error</h1>
              <p className="text-xs opacity-90 mt-1.5">
                An error occurred during authentication or OAuth sign-in. Please verify your credentials and try again.
              </p>
            </div>
            <Button size="sm" variant="destructive" className="gap-2 font-semibold">
              <Link href="/login">
                <ArrowLeftIcon className="size-4" />
                <span>Try Login Again</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
