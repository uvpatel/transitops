import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseAvailable } from "@/db";
import { fuelLogs, vehicles, drivers } from "@/db/schema";
import { getDefaultOrganizationId } from "@/lib/data";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ fuelLogs: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const rows = await db.select().from(fuelLogs).where(eq(fuelLogs.id, id));
      return NextResponse.json({ fuelLog: rows[0] ?? null });
    }

    const allFuelLogs = await db.select().from(fuelLogs);
    const allVehicles = await db.select().from(vehicles);
    const allDrivers = await db.select().from(drivers);

    const enrichedLogs = allFuelLogs.map((log: any) => {
      const vehicle = allVehicles.find((v: any) => v.id === log.vehicleId);
      const driver = allDrivers.find((d: any) => d.id === log.driverId);
      return {
        ...log,
        vehicle,
        driver,
      };
    });

    return NextResponse.json({ fuelLogs: enrichedLogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch fuel logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      vehicleId,
      driverId,
      fuelType,
      quantityLiters,
      pricePerLiter,
      odometerKm,
      fuelStationName,
      receiptNumber,
      organizationId,
    } = body;

    if (!vehicleId || !quantityLiters || !pricePerLiter) {
      return NextResponse.json(
        { error: "Vehicle, quantity, and price per liter are required" },
        { status: 400 }
      );
    }

    const orgId = organizationId || (await getDefaultOrganizationId());

    const liters = Number(quantityLiters);
    const price = Number(pricePerLiter);
    const totalAmount = String(liters * price);

    const [newLog] = await db
      .insert(fuelLogs)
      .values({
        organizationId: orgId,
        vehicleId,
        driverId: driverId || null,
        fuelType: fuelType || "DIESEL",
        quantityLiters: String(liters),
        pricePerLiter: String(price),
        totalAmount,
        odometerKm: odometerKm ? String(odometerKm) : "0.00",
        fuelStationName: fuelStationName || null,
        receiptNumber: receiptNumber || null,
        filledAt: new Date(),
      })
      .returning();

    // Update vehicle odometer
    if (odometerKm) {
      await db.update(vehicles).set({ odometerKm: String(odometerKm) }).where(eq(vehicles.id, vehicleId));
    }

    return NextResponse.json({ fuelLog: newLog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log fuel refill" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Fuel Log ID is required" }, { status: 400 });
    }

    await db.delete(fuelLogs).where(eq(fuelLogs.id, id));
    return NextResponse.json({ success: true, message: "Fuel log deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete fuel log" }, { status: 500 });
  }
}
