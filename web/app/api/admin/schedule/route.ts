import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "coordinator")) {
    return NextResponse.json({ error: "Ej behörig" }, { status: 403 });
  }

  const supabase = createServerClient();
  const { data: items } = await supabase
    .from("schedule_items")
    .select("*, assigned_guest:guests(name), event_part:event_parts(name)")
    .order("sort_order", { ascending: true });

  return NextResponse.json({ items: items || [] });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Ej behörig" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("schedule_items")
      .insert(body)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
