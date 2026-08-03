import { NextResponse } from "next/server";
import { db } from "@/db";
import { drivers } from "@/db/schema";

export async function GET() {
  try {
    const allDrivers = await db.select().from(drivers);
    return NextResponse.json({ drivers: allDrivers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}
