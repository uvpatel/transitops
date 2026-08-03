import { pgTable, uuid, varchar, text, integer, numeric, timestamp, jsonb, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";
import { organizations, users } from "./organizations";
import { vehicles } from "./vehicles";
import { drivers } from "./drivers";

export const tripTypeEnum = pgEnum("trip_type", [
  "DELIVERY",
  "PICKUP",
  "TRANSFER",
  "SERVICE",
  "PASSENGER",
  "OTHER"
]);

export const tripPriorityEnum = pgEnum("trip_priority", [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT"
]);

export const tripStatusEnum = pgEnum("trip_status", [
  "DRAFT",
  "PLANNED",
  "ASSIGNED",
  "READY",
  "IN_PROGRESS",
  "DELAYED",
  "COMPLETED",
  "CANCELLED",
  "FAILED"
]);

export const tripAssignmentStatusEnum = pgEnum("trip_assignment_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED"
]);

export const tripStopTypeEnum = pgEnum("trip_stop_type", [
  "PICKUP",
  "DELIVERY",
  "CHECKPOINT",
  "REST",
  "FUEL",
  "OTHER"
]);

export const tripStopStatusEnum = pgEnum("trip_stop_status", [
  "PENDING",
  "ARRIVED",
  "COMPLETED",
  "SKIPPED",
  "FAILED"
]);

export const eventTypeEnum = pgEnum("event_type", [
  "TRIP_STARTED",
  "TRIP_COMPLETED",
  "VEHICLE_BREAKDOWN",
  "ACCIDENT",
  "HARSH_BRAKING",
  "SPEEDING",
  "ROUTE_DEVIATION",
  "UNSCHEDULED_STOP",
  "DELIVERY_CONFIRMED",
  "DELAY_REPORTED"
]);

export const eventSeverityEnum = pgEnum("event_severity", [
  "INFO",
  "WARNING",
  "CRITICAL"
]);

export const trips = pgTable("trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  tripNumber: varchar("trip_number", { length: 50 }).notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  tripType: tripTypeEnum("trip_type").default("DELIVERY").notNull(),
  priority: tripPriorityEnum("priority").default("NORMAL").notNull(),
  status: tripStatusEnum("status").default("DRAFT").notNull(),
  originName: varchar("origin_name", { length: 255 }),
  originAddress: text("origin_address"),
  originLat: numeric("origin_lat", { precision: 10, scale: 7 }),
  originLng: numeric("origin_lng", { precision: 10, scale: 7 }),
  destinationName: varchar("destination_name", { length: 255 }),
  destinationAddress: text("destination_address"),
  destinationLat: numeric("destination_lat", { precision: 10, scale: 7 }),
  destinationLng: numeric("destination_lng", { precision: 10, scale: 7 }),
  scheduledStartAt: timestamp("scheduled_start_at", { withTimezone: true }).notNull(),
  scheduledEndAt: timestamp("scheduled_end_at", { withTimezone: true }).notNull(),
  actualStartAt: timestamp("actual_start_at", { withTimezone: true }),
  actualEndAt: timestamp("actual_end_at", { withTimezone: true }),
  estimatedDistanceKm: numeric("estimated_distance_km", { precision: 10, scale: 2 }),
  actualDistanceKm: numeric("actual_distance_km", { precision: 10, scale: 2 }),
  cargoDescription: text("cargo_description"),
  cargoWeightKg: numeric("cargo_weight_kg", { precision: 10, scale: 2 }),
  customerName: varchar("customer_name", { length: 150 }),
  customerPhone: varchar("customer_phone", { length: 30 }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  uniqueIndex("trips_org_number_unique").on(table.organizationId, table.tripNumber),
  index("idx_trips_org_status_start").on(table.organizationId, table.status, table.scheduledStartAt),
]);

export const tripAssignments = pgTable("trip_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tripId: uuid("trip_id").notNull().references(() => trips.id, { onDelete: "cascade" }),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  driverId: uuid("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  assignedBy: uuid("assigned_by").references(() => users.id, { onDelete: "set null" }),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  releasedAt: timestamp("released_at", { withTimezone: true }),
  status: tripAssignmentStatusEnum("status").default("PENDING").notNull(),
  notes: text("notes"),
}, (table) => [
  index("idx_trip_assignments_trip_id").on(table.tripId),
  index("idx_trip_assignments_vehicle").on(table.vehicleId, table.status),
  index("idx_trip_assignments_driver").on(table.driverId, table.status),
]);

export const tripStops = pgTable("trip_stops", {
  id: uuid("id").defaultRandom().primaryKey(),
  tripId: uuid("trip_id").notNull().references(() => trips.id, { onDelete: "cascade" }),
  sequenceNumber: integer("sequence_number").notNull(),
  stopType: tripStopTypeEnum("stop_type").default("DELIVERY").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  scheduledArrival: timestamp("scheduled_arrival", { withTimezone: true }),
  actualArrival: timestamp("actual_arrival", { withTimezone: true }),
  actualDeparture: timestamp("actual_departure", { withTimezone: true }),
  status: tripStopStatusEnum("status").default("PENDING").notNull(),
  contactName: varchar("contact_name", { length: 150 }),
  contactPhone: varchar("contact_phone", { length: 30 }),
  deliveryNotes: text("delivery_notes"),
  proofFileUrl: text("proof_file_url"),
}, (table) => [
  uniqueIndex("trip_stops_trip_seq_unique").on(table.tripId, table.sequenceNumber),
  index("idx_trip_stops_trip_id").on(table.tripId),
]);

export const tripStatusHistory = pgTable("trip_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  tripId: uuid("trip_id").notNull().references(() => trips.id, { onDelete: "cascade" }),
  previousStatus: tripStatusEnum("previous_status"),
  newStatus: tripStatusEnum("new_status").notNull(),
  reason: text("reason"),
  locationLat: numeric("location_lat", { precision: 10, scale: 7 }),
  locationLng: numeric("location_lng", { precision: 10, scale: 7 }),
  changedBy: uuid("changed_by").references(() => users.id, { onDelete: "set null" }),
  changedAt: timestamp("changed_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_trip_status_history_trip_id").on(table.tripId),
]);

export const tripEvents = pgTable("trip_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  tripId: uuid("trip_id").notNull().references(() => trips.id, { onDelete: "cascade" }),
  driverId: uuid("driver_id").references(() => drivers.id, { onDelete: "set null" }),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  eventType: eventTypeEnum("event_type").notNull(),
  severity: eventSeverityEnum("severity").default("INFO").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  description: text("description"),
  metadata: jsonb("metadata"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_trip_events_trip_id").on(table.tripId),
  index("idx_trip_events_type_severity").on(table.eventType, table.severity),
]);
