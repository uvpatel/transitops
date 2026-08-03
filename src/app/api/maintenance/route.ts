import { NextResponse } from "next/server";
import { db } from "@/db";
import { maintenanceWorkOrders } from "@/db/schema";

export async function GET() {
  try {
    const workOrders = await db.select().from(maintenanceWorkOrders);
    return NextResponse.json({ workOrders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch maintenance work orders" }, { status: 500 });
  }
}
