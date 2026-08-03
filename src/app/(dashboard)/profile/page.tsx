import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserCheckIcon, ShieldCheckIcon, KeyIcon } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">User Profile & Account Security</h2>
        <p className="text-sm text-muted-foreground">Manage personal details, password security, and active session tokens.</p>
      </div>

      <Card className="shadow-xs max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Urvil Patel</CardTitle>
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
              ADMINISTRATOR
            </Badge>
          </div>
          <CardDescription className="text-xs">urvil@transitops.com</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Full Name:</span>
              <Input defaultValue="Urvil Patel" className="mt-1 h-9" />
            </div>
            <div>
              <span className="text-muted-foreground">Email Address:</span>
              <Input defaultValue="urvil@transitops.com" readOnly className="mt-1 h-9 bg-muted/40" />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button size="sm">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
