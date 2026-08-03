import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseAvailable } from "@/db";
import { maintenanceWorkOrders, vehicles } from "@/db/schema";
import { getDefaultOrganizationId } from "@/lib/data";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ workOrders: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const rows = await db.select().from(maintenanceWorkOrders).where(eq(maintenanceWorkOrders.id, id));
      return NextResponse.json({ workOrder: rows[0] ?? null });
    }

    const allWorkOrders = await db.select().from(maintenanceWorkOrders);
    const allVehicles = await db.select().from(vehicles);

    const enrichedOrders = allWorkOrders.map((order: any) => {
      const vehicle = allVehicles.find((v: any) => v.id === order.vehicleId);
      return {
        ...order,
        vehicle,
      };
    });

    return NextResponse.json({ workOrders: enrichedOrders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch work orders" }, { status: 500 });
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
      maintenanceType,
      priority,
      reportedIssue,
      scheduledAt,
      laborCost,
      partsCost,
      organizationId,
    } = body;

    if (!vehicleId || !maintenanceType || !reportedIssue) {
      return NextResponse.json(
        { error: "Vehicle, maintenance type, and issue description are required" },
        { status: 400 }
      );
    }

    const orgId = organizationId || (await getDefaultOrganizationId());

    const workOrderNumber = `WO-${Math.floor(10000 + Math.random() * 90000)}`;
    const labor = Number(laborCost || 0);
    const parts = Number(partsCost || 0);
    const totalCost = String(labor + parts);

    const [newWorkOrder] = await db
      .insert(maintenanceWorkOrders)
      .values({
        organizationId: orgId,
        workOrderNumber,
        vehicleId,
        maintenanceType,
        priority: priority || "NORMAL",
        status: "OPEN",
        reportedIssue,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        laborCost: String(labor),
        partsCost: String(parts),
        totalCost,
      })
      .returning();

    // Transition vehicle status to MAINTENANCE
    await db.update(vehicles).set({ status: "MAINTENANCE" }).where(eq(vehicles.id, vehicleId));

    return NextResponse.json({ workOrder: newWorkOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create work order" }, { status: 500 });
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
      return NextResponse.json({ error: "Work Order ID and status are required" }, { status: 400 });
    }

    const [updatedOrder] = await db
      .update(maintenanceWorkOrders)
      .set({
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
        startedAt: status === "IN_PROGRESS" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(maintenanceWorkOrders.id, id))
      .returning();

    if (updatedOrder) {
      if (status === "COMPLETED" || status === "CANCELLED") {
        await db.update(vehicles).set({ status: "AVAILABLE" }).where(eq(vehicles.id, updatedOrder.vehicleId));
      } else if (status === "IN_PROGRESS" || status === "OPEN") {
        await db.update(vehicles).set({ status: "MAINTENANCE" }).where(eq(vehicles.id, updatedOrder.vehicleId));
      }
    }

    return NextResponse.json({ workOrder: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update work order" }, { status: 500 });
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
      return NextResponse.json({ error: "Work Order ID is required" }, { status: 400 });
    }

    await db.delete(maintenanceWorkOrders).where(eq(maintenanceWorkOrders.id, id));
    return NextResponse.json({ success: true, message: "Work Order deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete work order" }, { status: 500 });
  }
}
