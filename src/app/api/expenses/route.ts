import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";

export async function GET() {
  try {
    const allExpenses = await db.select().from(expenses);
    return NextResponse.json({ expenses: allExpenses });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}
