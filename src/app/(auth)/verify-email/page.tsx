import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MailCheckIcon, ArrowLeftIcon } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="p-6 border shadow-lg text-center">
          <CardContent className="p-0 space-y-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
              <MailCheckIcon className="size-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Verify Your Email</h1>
              <p className="text-xs text-muted-foreground mt-1.5">
                We sent a verification link to your email address. Please click the link to verify your account and unlock access.
              </p>
            </div>
            <Button  size="sm" className="gap-2 font-semibold">
              <Link href="/login">
                <ArrowLeftIcon className="size-4" />
                <span>Return to Login</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
