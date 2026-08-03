import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseAvailable } from "@/db";
import { drivers } from "@/db/schema";
import { getDefaultOrganizationId } from "@/lib/data";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ drivers: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const rows = await db.select().from(drivers).where(eq(drivers.id, id));
      return NextResponse.json({ driver: rows[0] ?? null });
    }

    const allDrivers = await db.select().from(drivers);
    return NextResponse.json({ drivers: allDrivers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch drivers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      employeeCode,
      employmentStatus,
      availabilityStatus,
      emergencyContactName,
      emergencyContactPhone,
      organizationId,
    } = body;

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    const orgId = organizationId || (await getDefaultOrganizationId());

    const [newDriver] = await db
      .insert(drivers)
      .values({
        organizationId: orgId,
        fullName,
        email: email || null,
        phone: phone || null,
        employeeCode: employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        employmentStatus: employmentStatus || "ACTIVE",
        availabilityStatus: availabilityStatus || "AVAILABLE",
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
      })
      .returning();

    return NextResponse.json({ driver: newDriver }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register driver" }, { status: 500 });
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
      return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });
    }

    const [updatedDriver] = await db
      .update(drivers)
      .set({
        ...updateFields,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, id))
      .returning();

    return NextResponse.json({ driver: updatedDriver });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update driver" }, { status: 500 });
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
      return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });
    }

    await db.delete(drivers).where(eq(drivers.id, id));
    return NextResponse.json({ success: true, message: "Driver deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete driver" }, { status: 500 });
  }
}
