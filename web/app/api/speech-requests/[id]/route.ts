import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "coordinator")) {
    return NextResponse.json({ error: "Ej behörig" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("speech_requests")
      .update({
        status: body.status,
        admin_note: body.admin_note || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ request: data });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
