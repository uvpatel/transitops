import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersIcon, UserPlusIcon, ShieldIcon, CheckCircle2Icon } from "lucide-react";

const mockUsers = [
  {
    id: "u-1",
    name: "Urvil Patel",
    email: "urvil@transitops.com",
    role: "ADMIN",
    status: "ACTIVE",
    lastLogin: "Just now",
  },
  {
    id: "u-2",
    name: "Alex Wright",
    email: "alex@transitops.com",
    role: "FLEET_MANAGER",
    status: "ACTIVE",
    lastLogin: "2 hours ago",
  },
  {
    id: "u-3",
    name: "Sarah Jenkins",
    email: "sarah@transitops.com",
    role: "DISPATCHER",
    status: "ACTIVE",
    lastLogin: "1 day ago",
  },
  {
    id: "u-4",
    name: "Marcus Vance",
    email: "marcus@transitops.com",
    role: "DRIVER",
    status: "ACTIVE",
    lastLogin: "3 days ago",
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Users & Role-Based Access (RBAC)</h2>
          <p className="text-sm text-muted-foreground">Manage team accounts, assign system roles, and control permission scopes.</p>
        </div>
        <Button size="sm" className="gap-1.5 font-semibold">
          <UserPlusIcon className="size-4" />
          <span>Invite New User</span>
        </Button>
      </div>

      {/* User Roster Table */}
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold">User Name</TableHead>
              <TableHead className="text-xs font-bold">Email Address</TableHead>
              <TableHead className="text-xs font-bold">Assigned Role</TableHead>
              <TableHead className="text-xs font-bold">Account Status</TableHead>
              <TableHead className="text-xs font-bold">Last Active</TableHead>
              <TableHead className="text-xs font-bold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-semibold text-primary">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    <ShieldIcon className="size-3 mr-1 inline text-primary" /> {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                    ACTIVE
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <Button size="xs" variant="ghost">
                    Manage Roles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
