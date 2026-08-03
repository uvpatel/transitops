import { AppRole, Permission } from "@/types/auth";
import { ROLE_PERMISSIONS } from "@/config/permissions";

export function hasPermission(role: AppRole | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasRole(userRole: AppRole | undefined | null, targetRoles: AppRole[]): boolean {
  if (!userRole) return false;
  return targetRoles.includes(userRole);
}
