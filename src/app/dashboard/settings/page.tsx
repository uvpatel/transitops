import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SettingsIcon, KeyIcon, BellIcon, ShieldIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">System Settings & Integrations</h2>
        <p className="text-sm text-muted-foreground">Configure telematics API keys, notifications, security policies, and theme preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <KeyIcon className="size-4 text-primary" /> Telematics API Keys
            </CardTitle>
            <CardDescription className="text-xs">API credentials for GPS stream & webhooks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground">Production API Key:</span>
              <Input readOnly value="tr_live_9921401928301923" className="mt-1 font-mono text-xs h-9 bg-muted/40" />
            </div>
            <Button size="xs" variant="outline">Roll API Key</Button>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BellIcon className="size-4 text-primary" /> Notification Dispatch Rules
            </CardTitle>
            <CardDescription className="text-xs">Channels for critical alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-muted/30">
              <span>Driver License Expiry Alert</span>
              <Badge className="bg-emerald-500/15 text-emerald-700">IN-APP & EMAIL</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/30">
              <span>Vehicle Breakdown & Overspeeding</span>
              <Badge className="bg-emerald-500/15 text-emerald-700">PUSH & SMS</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
