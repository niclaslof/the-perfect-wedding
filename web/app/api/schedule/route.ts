import { NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data: eventParts } = await supabase
    .from("event_parts")
    .select("*")
    .eq("wedding_id", session.wedding_id)
    .order("sort_order", { ascending: true });

  const { data: items } = await supabase
    .from("schedule_items")
    .select("*, assigned_guest:guests(name)")
    .eq("is_public", true)
    .order("sort_order", { ascending: true });

  return NextResponse.json({
    event_parts: eventParts || [],
    items: items || [],
  });
}
