import { NextResponse } from "next/server";
import { db } from "@/db";
import { fuelLogs } from "@/db/schema";

export async function GET() {
  try {
    const allFuelLogs = await db.select().from(fuelLogs);
    return NextResponse.json({ fuelLogs: allFuelLogs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fuel logs" }, { status: 500 });
  }
}
