import { redirect } from "next/navigation";
import { getCurrentSession } from "./current-user";
import { hasPermission } from "./permissions";
import { AppRole, Permission } from "@/types/auth";

export async function requirePermission(permission: Permission) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/sign-in");
  }

  const role = (session.user as any).role as AppRole | undefined;
  // If role is undefined, default to ADMIN for demonstration/owner accounts or check permission
  if (role && !hasPermission(role, permission)) {
    redirect("/unauthorized");
  }

  return session;
}
