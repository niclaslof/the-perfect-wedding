import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("guest_id", session.guest_id)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rsvp: data || null });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { attending, plus_one_attending, plus_one_name, message } = body;

    const supabase = createServerClient();

    // Upsert — either create or update
    const { data, error } = await supabase
      .from("rsvps")
      .upsert(
        {
          guest_id: session.guest_id,
          attending,
          plus_one_attending: plus_one_attending || false,
          plus_one_name: plus_one_name || null,
          message: message || null,
          responded_at: new Date().toISOString(),
        },
        { onConflict: "guest_id" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rsvp: data });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
