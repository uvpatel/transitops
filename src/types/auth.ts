export type AppRole =
  | "ADMIN"
  | "FLEET_MANAGER"
  | "DISPATCHER"
  | "DRIVER"
  | "SAFETY_OFFICER"
  | "FINANCIAL_ANALYST";

export type Permission =
  | "dashboard.view"
  | "vehicles.read"
  | "vehicles.create"
  | "vehicles.update"
  | "vehicles.delete"
  | "drivers.read"
  | "drivers.create"
  | "drivers.update"
  | "drivers.suspend"
  | "trips.read"
  | "trips.create"
  | "trips.assign"
  | "trips.update"
  | "trips.cancel"
  | "dispatch.view"
  | "dispatch.manage"
  | "maintenance.read"
  | "maintenance.create"
  | "maintenance.update"
  | "maintenance.approve"
  | "fuel.read"
  | "fuel.create"
  | "fuel.update"
  | "expenses.read"
  | "expenses.create"
  | "expenses.approve"
  | "expenses.reject"
  | "compliance.read"
  | "compliance.manage"
  | "analytics.view"
  | "reports.export"
  | "users.read"
  | "users.invite"
  | "users.update"
  | "users.delete"
  | "roles.read"
  | "roles.manage"
  | "audit.read"
  | "organization.read"
  | "organization.update"
  | "settings.read"
  | "settings.update";

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role?: AppRole;
    organizationId?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}
