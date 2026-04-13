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
    .from("dietary_preferences")
    .select("*")
    .eq("guest_id", session.guest_id)
    .order("is_plus_one", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ preferences: data || [] });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { is_plus_one, allergies, dietary_type, other_notes } = body;

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("dietary_preferences")
      .upsert(
        {
          guest_id: session.guest_id,
          is_plus_one: is_plus_one || false,
          allergies: allergies || [],
          dietary_type: dietary_type || "none",
          other_notes: other_notes || null,
        },
        { onConflict: "guest_id,is_plus_one" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ preference: data });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
