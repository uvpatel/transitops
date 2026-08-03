import { relations } from "drizzle-orm/_relations";
import { user, session, account } from "./auth-schema";
import { organizations, users, roles, userRoles } from "./organizations";
import { vehicles, vehicleDocuments, vehicleStatusHistory, vehicleAssignments } from "./vehicles";
import { drivers, driverLicenses, driverDocuments, driverSafetyScores } from "./drivers";
import { trips, tripStops, tripAssignments, tripStatusHistory, tripEvents } from "./trips";
import { serviceProviders, maintenanceWorkOrders, maintenanceItems } from "./maintenance";
import { fuelLogs } from "./fuel";
import { expenseCategories, expenses, payments } from "./expenses";

// User & Auth Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Organizations & Users Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  roles: many(roles),
  vehicles: many(vehicles),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

// Vehicles & Documents Relations
export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [vehicles.organizationId],
    references: [organizations.id],
  }),
  documents: many(vehicleDocuments),
  statusHistory: many(vehicleStatusHistory),
  vehicleAssignments: many(vehicleAssignments),
  tripAssignments: many(tripAssignments),
  maintenanceWorkOrders: many(maintenanceWorkOrders),
  fuelLogs: many(fuelLogs),
}));

export const vehicleDocumentsRelations = relations(vehicleDocuments, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleDocuments.vehicleId],
    references: [vehicles.id],
  }),
}));

export const vehicleAssignmentsRelations = relations(vehicleAssignments, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleAssignments.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [vehicleAssignments.driverId],
    references: [drivers.id],
  }),
}));

// Drivers Relations
export const driversRelations = relations(drivers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [drivers.organizationId],
    references: [organizations.id],
  }),
  licenses: many(driverLicenses),
  documents: many(driverDocuments),
  safetyScores: many(driverSafetyScores),
  vehicleAssignments: many(vehicleAssignments),
  tripAssignments: many(tripAssignments),
  fuelLogs: many(fuelLogs),
}));

export const driverLicensesRelations = relations(driverLicenses, ({ one }) => ({
  driver: one(drivers, {
    fields: [driverLicenses.driverId],
    references: [drivers.id],
  }),
}));

// Trips & Logistics Relations
export const tripsRelations = relations(trips, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [trips.organizationId],
    references: [organizations.id],
  }),
  assignments: many(tripAssignments),
  stops: many(tripStops),
  statusHistory: many(tripStatusHistory),
  events: many(tripEvents),
}));

export const tripAssignmentsRelations = relations(tripAssignments, ({ one }) => ({
  trip: one(trips, {
    fields: [tripAssignments.tripId],
    references: [trips.id],
  }),
  vehicle: one(vehicles, {
    fields: [tripAssignments.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [tripAssignments.driverId],
    references: [drivers.id],
  }),
}));

export const tripStopsRelations = relations(tripStops, ({ one }) => ({
  trip: one(trips, {
    fields: [tripStops.tripId],
    references: [trips.id],
  }),
}));

// Maintenance Relations
export const maintenanceWorkOrdersRelations = relations(maintenanceWorkOrders, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [maintenanceWorkOrders.organizationId],
    references: [organizations.id],
  }),
  vehicle: one(vehicles, {
    fields: [maintenanceWorkOrders.vehicleId],
    references: [vehicles.id],
  }),
  serviceProvider: one(serviceProviders, {
    fields: [maintenanceWorkOrders.serviceProviderId],
    references: [serviceProviders.id],
  }),
  items: many(maintenanceItems),
}));

// Fuel Relations
export const fuelLogsRelations = relations(fuelLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [fuelLogs.organizationId],
    references: [organizations.id],
  }),
  vehicle: one(vehicles, {
    fields: [fuelLogs.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [fuelLogs.driverId],
    references: [drivers.id],
  }),
}));

// Expenses Relations
export const expensesRelations = relations(expenses, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [expenses.organizationId],
    references: [organizations.id],
  }),
  category: one(expenseCategories, {
    fields: [expenses.categoryId],
    references: [expenseCategories.id],
  }),
  vehicle: one(vehicles, {
    fields: [expenses.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [expenses.driverId],
    references: [drivers.id],
  }),
  payments: many(payments),
}));
