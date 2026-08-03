import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseAvailable } from "@/db";
import { vehicles } from "@/db/schema";
import { getDefaultOrganizationId } from "@/lib/data";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ vehicles: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const rows = await db.select().from(vehicles).where(eq(vehicles.id, id));
      return NextResponse.json({ vehicle: rows[0] ?? null });
    }

    const allVehicles = await db.select().from(vehicles);
    return NextResponse.json({ vehicles: allVehicles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      registrationNumber,
      vehicleType,
      make,
      model,
      manufacturingYear,
      fuelType,
      capacityKg,
      odometerKm,
      status,
      organizationId,
    } = body;

    if (!registrationNumber || !vehicleType) {
      return NextResponse.json(
        { error: "Registration number and vehicle type are required" },
        { status: 400 }
      );
    }

    const orgId = organizationId || (await getDefaultOrganizationId());

    const [newVehicle] = await db
      .insert(vehicles)
      .values({
        organizationId: orgId,
        registrationNumber,
        vehicleType,
        make: make || null,
        model: model || null,
        manufacturingYear: manufacturingYear ? Number(manufacturingYear) : null,
        fuelType: fuelType || "DIESEL",
        capacityKg: capacityKg ? String(capacityKg) : null,
        odometerKm: odometerKm ? String(odometerKm) : "0.00",
        status: status || "AVAILABLE",
      })
      .returning();

    return NextResponse.json({ vehicle: newVehicle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create vehicle" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
    }

    const [updatedVehicle] = await db
      .update(vehicles)
      .set({
        ...updateFields,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning();

    return NextResponse.json({ vehicle: updatedVehicle });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update vehicle" }, { status: 500 });
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
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
    }

    await db.delete(vehicles).where(eq(vehicles.id, id));
    return NextResponse.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete vehicle" }, { status: 500 });
  }
}
