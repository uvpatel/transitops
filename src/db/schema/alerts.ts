import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { organizations, users } from "./organizations";
import { vehicles } from "./vehicles";
import { drivers } from "./drivers";
import { trips } from "./trips";
import { maintenanceWorkOrders } from "./maintenance";

export const alertTypeEnum = pgEnum("alert_type", [
  "LICENSE_EXPIRING",
  "LICENSE_EXPIRED",
  "INSURANCE_EXPIRING",
  "PERMIT_EXPIRING",
  "MAINTENANCE_DUE",
  "MAINTENANCE_OVERDUE",
  "TRIP_DELAYED",
  "VEHICLE_BREAKDOWN",
  "SPEEDING",
  "ROUTE_DEVIATION",
  "HIGH_FUEL_CONSUMPTION",
  "BUDGET_EXCEEDED"
]);

export const alertSeverityEnum = pgEnum("alert_severity", [
  "INFO",
  "WARNING",
  "CRITICAL"
]);

export const alertStatusEnum = pgEnum("alert_status", [
  "OPEN",
  "ACKNOWLEDGED",
  "RESOLVED",
  "DISMISSED"
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "IN_APP",
  "EMAIL",
  "SMS",
  "PUSH"
]);

export const alerts = pgTable("alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  alertType: alertTypeEnum("alert_type").notNull(),
  severity: alertSeverityEnum("severity").default("WARNING").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  driverId: uuid("driver_id").references(() => drivers.id, { onDelete: "set null" }),
  tripId: uuid("trip_id").references(() => trips.id, { onDelete: "set null" }),
  workOrderId: uuid("work_order_id").references(() => maintenanceWorkOrders.id, { onDelete: "set null" }),
  status: alertStatusEnum("status").default("OPEN").notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  acknowledgedBy: uuid("acknowledged_by").references(() => users.id, { onDelete: "set null" }),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
  resolvedBy: uuid("resolved_by").references(() => users.id, { onDelete: "set null" }),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_alerts_org_status").on(table.organizationId, table.status, table.severity),
  index("idx_alerts_vehicle_id").on(table.vehicleId),
  index("idx_alerts_driver_id").on(table.driverId),
  index("idx_alerts_trip_id").on(table.tripId),
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  alertId: uuid("alert_id").references(() => alerts.id, { onDelete: "cascade" }),
  channel: notificationChannelEnum("channel").default("IN_APP").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_notifications_user_id").on(table.userId),
  index("idx_notifications_alert_id").on(table.alertId),
]);
