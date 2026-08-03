import { NextResponse } from "next/server";
import { db } from "@/db";
import { trips } from "@/db/schema";

export async function GET() {
  try {
    const allTrips = await db.select().from(trips);
    return NextResponse.json({ trips: allTrips });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}
