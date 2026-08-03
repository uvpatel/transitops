import { pgTable, uuid, varchar, text, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { vehicles, fuelTypeEnum } from "./vehicles";
import { drivers } from "./drivers";
import { trips } from "./trips";

export const fuelLogs = pgTable("fuel_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  driverId: uuid("driver_id").references(() => drivers.id, { onDelete: "set null" }),
  tripId: uuid("trip_id").references(() => trips.id, { onDelete: "set null" }),
  fuelType: fuelTypeEnum("fuel_type").default("DIESEL").notNull(),
  quantityLiters: numeric("quantity_liters", { precision: 10, scale: 2 }).notNull(),
  pricePerLiter: numeric("price_per_liter", { precision: 10, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  odometerKm: numeric("odometer_km", { precision: 12, scale: 2 }).notNull(),
  fuelStationName: varchar("fuel_station_name", { length: 150 }),
  receiptNumber: varchar("receipt_number", { length: 100 }),
  receiptUrl: text("receipt_url"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  filledAt: timestamp("filled_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_fuel_logs_vehicle_date").on(table.vehicleId, table.filledAt),
  index("idx_fuel_logs_org_id").on(table.organizationId),
  index("idx_fuel_logs_driver_id").on(table.driverId),
  index("idx_fuel_logs_trip_id").on(table.tripId),
]);
