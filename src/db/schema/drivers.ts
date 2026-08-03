import { pgTable, uuid, varchar, text, boolean, timestamp, date, numeric, jsonb, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";
import { organizations, users } from "./organizations";

export const employmentStatusEnum = pgEnum("employment_status", [
  "ACTIVE",
  "ON_LEAVE",
  "SUSPENDED",
  "TERMINATED"
]);

export const driverAvailabilityStatusEnum = pgEnum("driver_availability_status", [
  "AVAILABLE",
  "ASSIGNED",
  "DRIVING",
  "OFF_DUTY",
  "ON_LEAVE"
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "PENDING",
  "VERIFIED",
  "REJECTED",
  "EXPIRED"
]);

export const driverDocTypeEnum = pgEnum("driver_doc_type", [
  "REGISTRATION_CERTIFICATE",
  "INSURANCE",
  "FITNESS_CERTIFICATE",
  "POLLUTION_CERTIFICATE",
  "ROAD_PERMIT",
  "TAX_RECEIPT",
  "ID_PROOF",
  "MEDICAL_CERTIFICATE",
  "OTHER"
]);

export const drivers = pgTable("drivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  employeeCode: varchar("employee_code", { length: 50 }),
  fullName: varchar("full_name", { length: 150 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  dateOfBirth: date("date_of_birth"),
  joiningDate: date("joining_date"),
  employmentStatus: employmentStatusEnum("employment_status").default("ACTIVE").notNull(),
  availabilityStatus: driverAvailabilityStatusEnum("availability_status").default("AVAILABLE").notNull(),
  emergencyContactName: varchar("emergency_contact_name", { length: 150 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 30 }),
  currentSafetyScore: numeric("current_safety_score", { precision: 5, scale: 2 }).default("100.00"),
  totalDistanceKm: numeric("total_distance_km", { precision: 12, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("idx_drivers_org_availability").on(table.organizationId, table.availabilityStatus),
  index("idx_drivers_user_id").on(table.userId),
]);

export const driverLicenses = pgTable("driver_licenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverId: uuid("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  licenseNumber: varchar("license_number", { length: 100 }).notNull(),
  licenseType: varchar("license_type", { length: 50 }).notNull(),
  issuingAuthority: varchar("issuing_authority", { length: 150 }),
  issuedAt: date("issued_at"),
  expiresAt: date("expires_at").notNull(),
  verificationStatus: verificationStatusEnum("verification_status").default("PENDING").notNull(),
  isPrimary: boolean("is_primary").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("driver_licenses_driver_id_license_number_unique").on(table.driverId, table.licenseNumber),
  index("idx_driver_licenses_expiry").on(table.expiresAt),
  index("idx_driver_licenses_driver_id").on(table.driverId),
]);

export const driverDocuments = pgTable("driver_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverId: uuid("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  documentType: driverDocTypeEnum("document_type").notNull(),
  documentNumber: varchar("document_number", { length: 100 }),
  fileUrl: text("file_url").notNull(),
  issuedAt: date("issued_at"),
  expiresAt: date("expires_at"),
  verificationStatus: verificationStatusEnum("verification_status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_driver_documents_driver_id").on(table.driverId),
]);

export const driverSafetyScores = pgTable("driver_safety_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverId: uuid("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  tripId: uuid("trip_id"),
  score: numeric("score", { precision: 5, scale: 2 }).notNull(),
  speedingPenalty: numeric("speeding_penalty", { precision: 5, scale: 2 }).default("0.00"),
  harshBrakingPenalty: numeric("harsh_braking_penalty", { precision: 5, scale: 2 }).default("0.00"),
  incidentPenalty: numeric("incident_penalty", { precision: 5, scale: 2 }).default("0.00"),
  complianceBonus: numeric("compliance_bonus", { precision: 5, scale: 2 }).default("0.00"),
  calculationDetails: jsonb("calculation_details"),
  calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_driver_safety_scores_driver_id").on(table.driverId),
]);

export const driverAvailability = pgTable("driver_availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverId: uuid("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  availableFrom: timestamp("available_from", { withTimezone: true }).notNull(),
  availableUntil: timestamp("available_until", { withTimezone: true }).notNull(),
  status: driverAvailabilityStatusEnum("status").notNull(),
  reason: text("reason"),
}, (table) => [
  index("idx_driver_availability_driver_id").on(table.driverId),
]);
