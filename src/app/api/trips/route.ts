import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseAvailable } from "@/db";
import { trips, tripAssignments, vehicles, drivers } from "@/db/schema";
import { getDefaultOrganizationId } from "@/lib/data";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ trips: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const rows = await db.select().from(trips).where(eq(trips.id, id));
      return NextResponse.json({ trip: rows[0] ?? null });
    }

    const allTrips = await db.select().from(trips);
    const assignments = await db.select().from(tripAssignments);
    const allVehicles = await db.select().from(vehicles);
    const allDrivers = await db.select().from(drivers);

    const enrichedTrips = allTrips.map((trip: any) => {
      const assignment = assignments.find((a: any) => a.tripId === trip.id);
      const vehicle = assignment ? allVehicles.find((v: any) => v.id === assignment.vehicleId) : null;
      const driver = assignment ? allDrivers.find((d: any) => d.id === assignment.driverId) : null;
      return {
        ...trip,
        vehicle,
        driver,
        assignment,
      };
    });

    return NextResponse.json({ trips: enrichedTrips });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch trips" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      title,
      tripType,
      priority,
      status,
      originName,
      destinationName,
      scheduledStartAt,
      scheduledEndAt,
      estimatedDistanceKm,
      vehicleId,
      driverId,
      organizationId,
    } = body;

    if (!title || !originName || !destinationName) {
      return NextResponse.json(
        { error: "Title, origin, and destination are required" },
        { status: 400 }
      );
    }

    const orgId = organizationId || (await getDefaultOrganizationId());

    // Business Logic Rules Validation:
    if (vehicleId) {
      const targetVehicle = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId));
      if (targetVehicle[0] && (targetVehicle[0].status === "IN_TRANSIT" || targetVehicle[0].status === "MAINTENANCE")) {
        return NextResponse.json(
          { error: `Vehicle ${targetVehicle[0].registrationNumber} is currently ${targetVehicle[0].status} and unavailable.` },
          { status: 400 }
        );
      }
    }

    if (driverId) {
      const targetDriver = await db.select().from(drivers).where(eq(drivers.id, driverId));
      if (targetDriver[0] && (targetDriver[0].employmentStatus !== "ACTIVE" || targetDriver[0].availabilityStatus === "DRIVING")) {
        return NextResponse.json(
          { error: `Driver ${targetDriver[0].fullName} is currently unavailable for new trips.` },
          { status: 400 }
        );
      }
    }

    if (estimatedDistanceKm !== undefined && estimatedDistanceKm !== null && Number(estimatedDistanceKm) < 0) {
      return NextResponse.json({ error: "Distance cannot be negative" }, { status: 400 });
    }

    const tripNumber = `TRIP-${Math.floor(10000 + Math.random() * 90000)}`;
    const [newTrip] = await db
      .insert(trips)
      .values({
        organizationId: orgId,
        tripNumber,
        title,
        tripType: tripType || "DELIVERY",
        priority: priority || "NORMAL",
        status: status || "ASSIGNED",
        originName,
        destinationName,
        scheduledStartAt: scheduledStartAt ? new Date(scheduledStartAt) : new Date(),
        scheduledEndAt: scheduledEndAt ? new Date(scheduledEndAt) : new Date(Date.now() + 86400000),
        estimatedDistanceKm: estimatedDistanceKm ? String(estimatedDistanceKm) : null,
      })
      .returning();

    if (vehicleId && driverId) {
      await db.insert(tripAssignments).values({
        tripId: newTrip.id,
        vehicleId,
        driverId,
        status: "ACTIVE",
      });

      if (status === "IN_PROGRESS") {
        await db.update(vehicles).set({ status: "IN_TRANSIT" }).where(eq(vehicles.id, vehicleId));
        await db.update(drivers).set({ availabilityStatus: "DRIVING" }).where(eq(drivers.id, driverId));
      } else {
        await db.update(vehicles).set({ status: "ASSIGNED" }).where(eq(vehicles.id, vehicleId));
        await db.update(drivers).set({ availabilityStatus: "ASSIGNED" }).where(eq(drivers.id, driverId));
      }
    }

    return NextResponse.json({ trip: newTrip }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create trip" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, title, tripType, priority, status, originName, destinationName, estimatedDistanceKm, vehicleId, driverId } = body;

    if (!id) {
      return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
    }

    if (estimatedDistanceKm !== undefined && estimatedDistanceKm !== null && Number(estimatedDistanceKm) < 0) {
      return NextResponse.json({ error: "Distance cannot be negative" }, { status: 400 });
    }

    const [updatedTrip] = await db
      .update(trips)
      .set({
        title,
        tripType,
        priority,
        status,
        originName,
        destinationName,
        estimatedDistanceKm: estimatedDistanceKm ? String(estimatedDistanceKm) : null,
        updatedAt: new Date(),
      })
      .where(eq(trips.id, id))
      .returning();

    if (vehicleId && driverId) {
      await db.delete(tripAssignments).where(eq(tripAssignments.tripId, id));
      await db.insert(tripAssignments).values({
        tripId: id,
        vehicleId,
        driverId,
        status: "ACTIVE",
      });
    }

    return NextResponse.json({ trip: updatedTrip });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update trip" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Trip ID and status are required" }, { status: 400 });
    }

    const [updatedTrip] = await db
      .update(trips)
      .set({
        status,
        actualStartAt: status === "IN_PROGRESS" ? new Date() : undefined,
        actualEndAt: status === "COMPLETED" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(trips.id, id))
      .returning();

    // Cascading state changes
    const assignments = await db.select().from(tripAssignments).where(eq(tripAssignments.tripId, id));
    if (assignments.length > 0) {
      const { vehicleId, driverId } = assignments[0];

      if (status === "IN_PROGRESS") {
        await db.update(vehicles).set({ status: "IN_TRANSIT" }).where(eq(vehicles.id, vehicleId));
        await db.update(drivers).set({ availabilityStatus: "DRIVING" }).where(eq(drivers.id, driverId));
      } else if (status === "COMPLETED" || status === "CANCELLED") {
        await db.update(vehicles).set({ status: "AVAILABLE" }).where(eq(vehicles.id, vehicleId));
        await db.update(drivers).set({ availabilityStatus: "AVAILABLE" }).where(eq(drivers.id, driverId));
      }
    }

    return NextResponse.json({ trip: updatedTrip });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update trip" }, { status: 500 });
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
      return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
    }

    await db.delete(trips).where(eq(trips.id, id));
    return NextResponse.json({ success: true, message: "Trip deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete trip" }, { status: 500 });
  }
}
