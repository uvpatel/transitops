import { pgTable, uuid, varchar, text, integer, numeric, boolean, date, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { organizations, users } from "./organizations";
import { vehicles } from "./vehicles";
import { tripPriorityEnum } from "./trips";

export const scheduleBasisEnum = pgEnum("schedule_basis", [
  "TIME",
  "ODOMETER",
  "BOTH"
]);

export const maintenanceTypeEnum = pgEnum("maintenance_type", [
  "GENERAL_SERVICE",
  "OIL_CHANGE",
  "TYRE_REPLACEMENT",
  "BRAKE_SERVICE",
  "ENGINE_SERVICE",
  "INSPECTION",
  "OTHER"
]);

export const workOrderStatusEnum = pgEnum("work_order_status", [
  "OPEN",
  "SCHEDULED",
  "IN_PROGRESS",
  "WAITING_FOR_PARTS",
  "COMPLETED",
  "CANCELLED"
]);

export const maintenanceItemTypeEnum = pgEnum("maintenance_item_type", [
  "PART",
  "LABOR",
  "SERVICE",
  "OTHER"
]);

export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  maintenanceType: maintenanceTypeEnum("maintenance_type").notNull(),
  scheduleBasis: scheduleBasisEnum("schedule_basis").default("TIME").notNull(),
  intervalDays: integer("interval_days"),
  intervalKm: numeric("interval_km", { precision: 10, scale: 2 }),
  lastServiceDate: date("last_service_date"),
  lastServiceOdometer: numeric("last_service_odometer", { precision: 12, scale: 2 }),
  nextDueDate: date("next_due_date"),
  nextDueOdometer: numeric("next_due_odometer", { precision: 12, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_maintenance_due_date").on(table.nextDueDate),
  index("idx_maintenance_schedules_vehicle_id").on(table.vehicleId),
]);

export const serviceProviders = pgTable("service_providers", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 150 }).notNull(),
  contactPerson: varchar("contact_person", { length: 150 }),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  taxNumber: varchar("tax_number", { length: 100 }),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
  index("idx_service_providers_org_id").on(table.organizationId),
]);

export const maintenanceWorkOrders = pgTable("maintenance_work_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  workOrderNumber: varchar("work_order_number", { length: 50 }).notNull(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  scheduleId: uuid("schedule_id").references(() => maintenanceSchedules.id, { onDelete: "set null" }),
  serviceProviderId: uuid("service_provider_id").references(() => serviceProviders.id, { onDelete: "set null" }),
  maintenanceType: maintenanceTypeEnum("maintenance_type").notNull(),
  priority: tripPriorityEnum("priority").default("NORMAL").notNull(),
  status: workOrderStatusEnum("status").default("OPEN").notNull(),
  reportedIssue: text("reported_issue"),
  diagnosis: text("diagnosis"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  odometerAtService: numeric("odometer_at_service", { precision: 12, scale: 2 }),
  laborCost: numeric("labor_cost", { precision: 10, scale: 2 }).default("0.00"),
  partsCost: numeric("parts_cost", { precision: 10, scale: 2 }).default("0.00"),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).default("0.00"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }).default("0.00"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("idx_work_orders_org_id").on(table.organizationId),
  index("idx_work_orders_vehicle_id").on(table.vehicleId),
  index("idx_work_orders_status").on(table.status),
]);

export const maintenanceItems = pgTable("maintenance_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  workOrderId: uuid("work_order_id").notNull().references(() => maintenanceWorkOrders.id, { onDelete: "cascade" }),
  itemType: maintenanceItemTypeEnum("item_type").notNull(),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).default("1.00").notNull(),
  unitCost: numeric("unit_cost", { precision: 10, scale: 2 }).notNull(),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }).notNull(),
}, (table) => [
  index("idx_maintenance_items_work_order_id").on(table.workOrderId),
]);
