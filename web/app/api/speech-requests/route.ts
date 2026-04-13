import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const supabase = createServerClient();

  // Admin/coordinator sees all, guest sees own
  const query = supabase
    .from("speech_requests")
    .select("*, guest:guests(name), event_part:event_parts(name)")
    .order("created_at", { ascending: false });

  if (session.role === "guest") {
    query.eq("guest_id", session.guest_id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data || [] });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  try {
    const body = await req.json();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("speech_requests")
      .insert({
        guest_id: session.guest_id,
        event_part_id: body.event_part_id,
        preferred_time: body.preferred_time || null,
        estimated_minutes: body.estimated_minutes || 5,
        topic: body.topic || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ request: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
