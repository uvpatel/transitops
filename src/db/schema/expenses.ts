import { pgTable, uuid, varchar, text, numeric, boolean, date, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { organizations, users } from "./organizations";
import { vehicles } from "./vehicles";
import { drivers } from "./drivers";
import { trips } from "./trips";
import { maintenanceWorkOrders } from "./maintenance";

export const expenseStatusEnum = pgEnum("expense_status", [
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "PAID"
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "CASH",
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CHEQUE",
  "FUEL_CARD",
  "OTHER"
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED"
]);

export const expenseCategories = pgTable("expense_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
  index("idx_expense_categories_org_id").on(table.organizationId),
]);

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  expenseNumber: varchar("expense_number", { length: 50 }).notNull(),
  categoryId: uuid("category_id").notNull().references(() => expenseCategories.id, { onDelete: "cascade" }),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  driverId: uuid("driver_id").references(() => drivers.id, { onDelete: "set null" }),
  tripId: uuid("trip_id").references(() => trips.id, { onDelete: "set null" }),
  workOrderId: uuid("work_order_id").references(() => maintenanceWorkOrders.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).default("0.00"),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  expenseDate: date("expense_date").notNull(),
  vendorName: varchar("vendor_name", { length: 150 }),
  description: text("description"),
  receiptUrl: text("receipt_url"),
  status: expenseStatusEnum("status").default("SUBMITTED").notNull(),
  submittedBy: uuid("submitted_by").references(() => users.id, { onDelete: "set null" }),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("idx_expenses_org_date").on(table.organizationId, table.expenseDate),
  index("idx_expenses_vehicle_id").on(table.vehicleId),
  index("idx_expenses_driver_id").on(table.driverId),
  index("idx_expenses_trip_id").on(table.tripId),
]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  expenseId: uuid("expense_id").references(() => expenses.id, { onDelete: "set null" }),
  paymentReference: varchar("payment_reference", { length: 100 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("COMPLETED").notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }).notNull(),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
}, (table) => [
  index("idx_payments_org_id").on(table.organizationId),
  index("idx_payments_expense_id").on(table.expenseId),
]);
