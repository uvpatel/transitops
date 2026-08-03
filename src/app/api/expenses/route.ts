import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseAvailable } from "@/db";
import { expenses, vehicles, drivers } from "@/db/schema";
import { getDefaultOrganizationId, getDefaultExpenseCategoryId } from "@/lib/data";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ expenses: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const rows = await db.select().from(expenses).where(eq(expenses.id, id));
      return NextResponse.json({ expense: rows[0] ?? null });
    }

    const allExpenses = await db.select().from(expenses);
    const allVehicles = await db.select().from(vehicles);
    const allDrivers = await db.select().from(drivers);

    const enrichedExpenses = allExpenses.map((exp: any) => {
      const vehicle = allVehicles.find((v: any) => v.id === exp.vehicleId);
      const driver = allDrivers.find((d: any) => d.id === exp.driverId);
      return {
        ...exp,
        vehicle,
        driver,
      };
    });

    return NextResponse.json({ expenses: enrichedExpenses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Database connection not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      amount,
      vendorName,
      description,
      expenseDate,
      vehicleId,
      driverId,
      organizationId,
      categoryId,
    } = body;

    if (!amount || !description) {
      return NextResponse.json({ error: "Amount and description are required" }, { status: 400 });
    }

    const orgId = organizationId || (await getDefaultOrganizationId());
    const catId = categoryId || (await getDefaultExpenseCategoryId(orgId));

    const expenseNumber = `EXP-${Math.floor(10000 + Math.random() * 90000)}`;
    const [newExpense] = await db
      .insert(expenses)
      .values({
        organizationId: orgId,
        expenseNumber,
        categoryId: catId,
        vehicleId: vehicleId || null,
        driverId: driverId || null,
        amount: String(amount),
        currency: "USD",
        expenseDate: expenseDate || new Date().toISOString().slice(0, 10),
        vendorName: vendorName || null,
        description,
        status: "SUBMITTED",
      })
      .returning();

    return NextResponse.json({ expense: newExpense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to file expense" }, { status: 500 });
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
      return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
    }

    await db.delete(expenses).where(eq(expenses.id, id));
    return NextResponse.json({ success: true, message: "Expense deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete expense" }, { status: 500 });
  }
}
