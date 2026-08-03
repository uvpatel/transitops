"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TruckIcon, ArrowLeftIcon, MailIcon } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.info("Password reset request submitted. Check your inbox if configured.");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="p-6 border shadow-lg">
          <CardContent className="p-0 space-y-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <TruckIcon className="size-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Reset Password</h1>
              <p className="text-xs text-muted-foreground">
                Enter your account email to receive a password reset link
              </p>
            </div>

            {submitted ? (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center space-y-2 text-xs">
                <MailIcon className="size-6 text-blue-600 mx-auto" />
                <p className="font-bold text-blue-700 dark:text-blue-400">Instructions Sent</p>
                <p className="text-muted-foreground">
                  If an account exists for <span className="font-medium text-foreground">{email}</span>, password reset instructions have been dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold">Registered Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@transitops.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full font-semibold">
                  Send Reset Link
                </Button>
              </form>
            )}

            <div className="pt-2 text-center">
              <Link href="/login" className="inline-flex items-center text-xs text-primary font-semibold hover:underline gap-1">
                <ArrowLeftIcon className="size-3.5" /> Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
