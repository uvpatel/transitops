import { eq } from "drizzle-orm";
import { db, isDatabaseAvailable } from "@/db";
import {
  drivers,
  expenses,
  expenseCategories,
  fuelLogs,
  maintenanceWorkOrders,
  organizations,
  trips,
  users,
  vehicles,
} from "@/db/schema";

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  vehiclesInTransit: number;
  maintenanceOpen: number;
  activeTrips: number;
  completedTrips: number;
  totalExpenses: number;
  totalFuelCost: number;
  totalDrivers: number;
  activeUsers: number;
}

function safeNumber(value: string | number | null | undefined) {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export async function getDefaultOrganizationId(): Promise<string> {
  if (!isDatabaseAvailable()) {
    return "00000000-0000-0000-0000-000000000000";
  }
  try {
    const existing = await db.select().from(organizations).limit(1);
    if (existing.length > 0) {
      return existing[0].id;
    }
    const [created] = await db
      .insert(organizations)
      .values({
        name: "TransitOps Organization",
        code: "TRANSITOPS_MAIN",
      })
      .returning();
    return created.id;
  } catch {
    return "00000000-0000-0000-0000-000000000000";
  }
}

export async function getDefaultExpenseCategoryId(organizationId: string): Promise<string> {
  if (!isDatabaseAvailable()) {
    return "00000000-0000-0000-0000-000000000000";
  }
  try {
    const existing = await db.select().from(expenseCategories).limit(1);
    if (existing.length > 0) {
      return existing[0].id;
    }
    const [created] = await db
      .insert(expenseCategories)
      .values({
        organizationId,
        name: "General Operational Expenses",
        code: "GENERAL",
      })
      .returning();
    return created.id;
  } catch {
    return "00000000-0000-0000-0000-000000000000";
  }
}


export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isDatabaseAvailable()) {
    return {
      totalVehicles: 0,
      availableVehicles: 0,
      vehiclesInTransit: 0,
      maintenanceOpen: 0,
      activeTrips: 0,
      completedTrips: 0,
      totalExpenses: 0,
      totalFuelCost: 0,
      totalDrivers: 0,
      activeUsers: 0,
    };
  }

  try {
    const [vehicleRows, tripRows, driverRows, workOrderRows, expenseRows, fuelRows, userRows] = await Promise.all([
      db.select().from(vehicles),
      db.select().from(trips),
      db.select().from(drivers),
      db.select().from(maintenanceWorkOrders),
      db.select().from(expenses),
      db.select().from(fuelLogs),
      db.select().from(users),
    ]);

    const availableVehicles = vehicleRows.filter((vehicle:any) => vehicle.status === "AVAILABLE").length;
    const vehiclesInTransit = vehicleRows.filter((vehicle:any) => vehicle.status === "IN_TRANSIT").length;
    const maintenanceOpen = workOrderRows.filter((workOrder:any) => workOrder.status !== "COMPLETED" && workOrder.status !== "CANCELLED").length;
    const activeTrips = tripRows.filter((trip:any) => trip.status === "ASSIGNED" || trip.status === "IN_PROGRESS" || trip.status === "READY").length;
    const completedTrips = tripRows.filter((trip:any) => trip.status === "COMPLETED").length;
    const totalExpenses = expenseRows.reduce((acc:any, expense:any) => acc + safeNumber(expense.amount), 0);
    const totalFuelCost = fuelRows.reduce((acc:any, fuel:any) => acc + safeNumber(fuel.totalAmount), 0);
    const activeUsers = userRows.filter((user:any) => user.status === "ACTIVE").length;

    return {
      totalVehicles: vehicleRows.length,
      availableVehicles,
      vehiclesInTransit,
      maintenanceOpen,
      activeTrips,
      completedTrips,
      totalExpenses,
      totalFuelCost,
      totalDrivers: driverRows.length,
      activeUsers,
    };
  } catch {
    return {
      totalVehicles: 0,
      availableVehicles: 0,
      vehiclesInTransit: 0,
      maintenanceOpen: 0,
      activeTrips: 0,
      completedTrips: 0,
      totalExpenses: 0,
      totalFuelCost: 0,
      totalDrivers: 0,
      activeUsers: 0,
    };
  }
}

export async function getDashboardSeries() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    const tripRows = await db.select().from(trips);
    const byDay = new Map<string, number>();

    tripRows.forEach((trip:any) => {
      const dateValue = trip.createdAt ? trip.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      byDay.set(dateValue, (byDay.get(dateValue) ?? 0) + 1);
    });

    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10)
      .map(([date, count]) => ({ date, trips: count }));
  } catch {
    return [];
  }
}

export async function getVehicles() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    return await db.select().from(vehicles);
  } catch {
    return [];
  }
}

export async function getVehicleById(id: string) {
  if (!isDatabaseAvailable()) {
    return null;
  }

  try {
    const rows = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getDrivers() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    return await db.select().from(drivers);
  } catch {
    return [];
  }
}

export async function getDriverById(id: string) {
  if (!isDatabaseAvailable()) {
    return null;
  }

  try {
    const rows = await db.select().from(drivers).where(eq(drivers.id, id));
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getTrips() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    return await db.select().from(trips);
  } catch {
    return [];
  }
}

export async function getTripById(id: string) {
  if (!isDatabaseAvailable()) {
    return null;
  }

  try {
    const rows = await db.select().from(trips).where(eq(trips.id, id));
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getWorkOrders() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    return await db.select().from(maintenanceWorkOrders);
  } catch {
    return [];
  }
}

export async function getExpenses() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    return await db.select().from(expenses);
  } catch {
    return [];
  }
}

export async function getFuelLogs() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    return await db.select().from(fuelLogs);
  } catch {
    return [];
  }
}

export async function getUsers() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    return await db.select().from(users);
  } catch {
    return [];
  }
}

export async function getOrganizations() {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    return await db.select().from(organizations);
  } catch {
    return [];
  }
}

export { formatCurrency };
