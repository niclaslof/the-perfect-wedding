import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,O,0,1
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Ej behörig" }, { status: 403 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("wedding_id", session.wedding_id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ guests: data });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Ej behörig" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, role, coordinator_type, plus_one_allowed } = body;

    if (!name) {
      return NextResponse.json({ error: "Namn krävs" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Generate unique invite code
    let invite_code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("guests")
        .select("id")
        .eq("invite_code", invite_code)
        .single();
      if (!existing) break;
      invite_code = generateCode();
      attempts++;
    }

    const { data, error } = await supabase
      .from("guests")
      .insert({
        wedding_id: session.wedding_id,
        name,
        email: email || null,
        phone: phone || null,
        invite_code,
        role: role || "guest",
        coordinator_type: coordinator_type || null,
        plus_one_allowed: plus_one_allowed || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ guest: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
