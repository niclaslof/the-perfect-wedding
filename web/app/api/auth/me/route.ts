import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ guest: null }, { status: 401 });
  }
  return NextResponse.json({ guest: session });
}
