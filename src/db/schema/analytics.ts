import { pgTable, uuid, varchar, text, integer, numeric, date, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { organizations, users } from "./organizations";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: uuid("entity_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: varchar("ip_address", { length: 100 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_audit_logs_org_id").on(table.organizationId),
  index("idx_audit_logs_user_id").on(table.userId),
  index("idx_audit_logs_action").on(table.action),
]);

export const dailyFleetMetrics = pgTable("daily_fleet_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  metricDate: date("metric_date").notNull(),
  totalVehicles: integer("total_vehicles").default(0).notNull(),
  availableVehicles: integer("available_vehicles").default(0).notNull(),
  vehiclesInTransit: integer("vehicles_in_transit").default(0).notNull(),
  vehiclesInMaintenance: integer("vehicles_in_maintenance").default(0).notNull(),
  totalTrips: integer("total_trips").default(0).notNull(),
  completedTrips: integer("completed_trips").default(0).notNull(),
  cancelledTrips: integer("cancelled_trips").default(0).notNull(),
  totalDistanceKm: numeric("total_distance_km", { precision: 12, scale: 2 }).default("0.00"),
  totalFuelLiters: numeric("total_fuel_liters", { precision: 12, scale: 2 }).default("0.00"),
  totalFuelCost: numeric("total_fuel_cost", { precision: 12, scale: 2 }).default("0.00"),
  totalMaintenanceCost: numeric("total_maintenance_cost", { precision: 12, scale: 2 }).default("0.00"),
  totalOperatingCost: numeric("total_operating_cost", { precision: 12, scale: 2 }).default("0.00"),
  vehicleUtilizationPercent: numeric("vehicle_utilization_percent", { precision: 5, scale: 2 }).default("0.00"),
  onTimeDeliveryPercent: numeric("on_time_delivery_percent", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("daily_fleet_metrics_org_date_unique").on(table.organizationId, table.metricDate),
  index("idx_daily_fleet_metrics_org_id").on(table.organizationId),
]);
