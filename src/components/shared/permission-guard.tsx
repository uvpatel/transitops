"use client";

import * as React from "react";
import { useSession } from "@/lib/auth-client";
import { Permission, AppRole } from "@/types/auth";
import { hasPermission } from "@/lib/permissions";

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as AppRole | undefined;

  // If session is present and user has permission (or role is undefined/ADMIN default)
  const allowed = role ? hasPermission(role, permission) : true;

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
