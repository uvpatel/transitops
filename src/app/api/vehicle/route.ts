import { NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";

export async function GET() {
  try {
    const allVehicles = await db.select().from(vehicles);
    return NextResponse.json({ vehicles: allVehicles });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
