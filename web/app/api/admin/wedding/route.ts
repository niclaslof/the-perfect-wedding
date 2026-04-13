import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Ej behörig" }, { status: 403 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("id", session.wedding_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ wedding: data });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Ej behörig" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("weddings")
      .update(body)
      .eq("id", session.wedding_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ wedding: data });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
