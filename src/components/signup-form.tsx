"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TruckIcon, Loader2Icon, GitBranchIcon } from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      if (res?.error) {
        toast.error(res.error.message || "Failed to create account.");
      } else {
        toast.success("Account created successfully! Redirecting to dashboard...");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred during account creation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to authenticate with GitHub.");
      setIsGithubLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6 justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <TruckIcon className="size-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Create TransitOps Account</h1>
              <p className="text-sm text-muted-foreground">
                Register your fleet management account
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Urvil Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading || isGithubLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@transitops.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isGithubLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isGithubLoading}
                />
              </div>

              <Button type="submit" className="w-full font-semibold" disabled={isLoading || isGithubLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Or register with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full font-semibold gap-2"
              onClick={handleGithubSignIn}
              disabled={isLoading || isGithubLoading}
            >
              {isGithubLoading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <GitBranchIcon className="size-4" />
              )}
              <span>Continue with GitHub</span>
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>

          <div className="relative hidden bg-slate-900 md:flex items-center justify-center p-8 text-white">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80')` }} />
            <div className="relative z-10 space-y-4 max-w-sm text-center">
              <h2 className="text-2xl font-bold tracking-tight">Join TransitOps Fleet Platform</h2>
              <p className="text-xs text-slate-300">
                Streamline fleet operations, driver safety scoring, and expense management under a single multi-tenant dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
