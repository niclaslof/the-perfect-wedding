import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { createSession } from "@/app/lib/session";
import type { Guest } from "@/app/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Kod saknas" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("invite_code", code.trim().toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Ogiltig kod" }, { status: 401 });
    }

    const guest = data as Guest;

    // Update last_seen_at
    await supabase
      .from("guests")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", guest.id);

    // Create session
    await createSession({
      guest_id: guest.id,
      wedding_id: guest.wedding_id,
      role: guest.role,
      name: guest.name,
    });

    return NextResponse.json({
      guest: {
        id: guest.id,
        name: guest.name,
        role: guest.role,
        coordinator_type: guest.coordinator_type,
        wedding_id: guest.wedding_id,
      },
    });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
