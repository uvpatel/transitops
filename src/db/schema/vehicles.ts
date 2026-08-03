import { pgTable, uuid, varchar, text, integer, numeric, date, timestamp, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";
import { organizations, users } from "./organizations";
import { drivers, verificationStatusEnum } from "./drivers";

export const vehicleTypeEnum = pgEnum("vehicle_type", [
  "TRUCK",
  "VAN",
  "BUS",
  "CAR",
  "TRAILER",
  "TANKER",
  "PICKUP",
  "OTHER"
]);

export const vehicleStatusEnum = pgEnum("vehicle_status", [
  "AVAILABLE",
  "ASSIGNED",
  "IN_TRANSIT",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
  "RETIRED"
]);

export const fuelTypeEnum = pgEnum("fuel_type", [
  "DIESEL",
  "PETROL",
  "CNG",
  "ELECTRIC",
  "HYBRID"
]);

export const vehicleDocTypeEnum = pgEnum("vehicle_doc_type", [
  "REGISTRATION_CERTIFICATE",
  "INSURANCE",
  "FITNESS_CERTIFICATE",
  "POLLUTION_CERTIFICATE",
  "ROAD_PERMIT",
  "TAX_RECEIPT",
  "OTHER"
]);

export const vehicleAssignmentTypeEnum = pgEnum("vehicle_assignment_type", [
  "PERMANENT",
  "TEMPORARY",
  "TRIP_SPECIFIC"
]);

export const vehicleAssignmentStatusEnum = pgEnum("vehicle_assignment_status", [
  "ACTIVE",
  "COMPLETED",
  "CANCELLED"
]);

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  registrationNumber: varchar("registration_number", { length: 50 }).notNull(),
  vin: varchar("vin", { length: 100 }),
  vehicleType: vehicleTypeEnum("vehicle_type").notNull(),
  make: varchar("make", { length: 100 }),
  model: varchar("model", { length: 100 }),
  manufacturingYear: integer("manufacturing_year"),
  fuelType: fuelTypeEnum("fuel_type").default("DIESEL").notNull(),
  capacityKg: numeric("capacity_kg", { precision: 10, scale: 2 }),
  capacityVolumeM3: numeric("capacity_volume_m3", { precision: 10, scale: 2 }),
  odometerKm: numeric("odometer_km", { precision: 12, scale: 2 }).default("0.00"),
  purchaseDate: date("purchase_date"),
  purchasePrice: numeric("purchase_price", { precision: 12, scale: 2 }),
  insuranceExpiryDate: date("insurance_expiry_date"),
  permitExpiryDate: date("permit_expiry_date"),
  fitnessExpiryDate: date("fitness_expiry_date"),
  status: vehicleStatusEnum("status").default("AVAILABLE").notNull(),
  currentLocationLat: numeric("current_location_lat", { precision: 10, scale: 7 }),
  currentLocationLng: numeric("current_location_lng", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  uniqueIndex("vehicles_org_reg_unique").on(table.organizationId, table.registrationNumber),
  index("idx_vehicles_org_status").on(table.organizationId, table.status),
]);

export const vehicleDocuments = pgTable("vehicle_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  documentType: vehicleDocTypeEnum("document_type").notNull(),
  documentNumber: varchar("document_number", { length: 100 }),
  fileUrl: text("file_url").notNull(),
  issuedAt: date("issued_at"),
  expiresAt: date("expires_at"),
  verificationStatus: verificationStatusEnum("verification_status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_vehicle_documents_expiry").on(table.expiresAt),
  index("idx_vehicle_documents_vehicle_id").on(table.vehicleId),
]);

export const vehicleStatusHistory = pgTable("vehicle_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  previousStatus: vehicleStatusEnum("previous_status"),
  newStatus: vehicleStatusEnum("new_status").notNull(),
  reason: text("reason"),
  changedBy: uuid("changed_by").references(() => users.id, { onDelete: "set null" }),
  changedAt: timestamp("changed_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_vehicle_status_history_vehicle_id").on(table.vehicleId),
]);

export const vehicleAssignments = pgTable("vehicle_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  driverId: uuid("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }),
  assignmentType: vehicleAssignmentTypeEnum("assignment_type").default("TRIP_SPECIFIC").notNull(),
  status: vehicleAssignmentStatusEnum("status").default("ACTIVE").notNull(),
  assignedBy: uuid("assigned_by").references(() => users.id, { onDelete: "set null" }),
  notes: text("notes"),
}, (table) => [
  index("idx_vehicle_assignments_vehicle_id").on(table.vehicleId),
  index("idx_vehicle_assignments_driver_id").on(table.driverId),
]);
