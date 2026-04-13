import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const channelId = req.nextUrl.searchParams.get("channel_id");
  if (!channelId) return NextResponse.json({ error: "channel_id krävs" }, { status: 400 });

  const supabase = createServerClient();

  // Verify membership
  const { data: member } = await supabase
    .from("chat_channel_members")
    .select("guest_id")
    .eq("channel_id", channelId)
    .eq("guest_id", session.guest_id)
    .single();

  if (!member) return NextResponse.json({ error: "Ej medlem" }, { status: 403 });

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*, guest:guests(name)")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data || [] });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  try {
    const { channel_id, content } = await req.json();
    if (!channel_id || !content?.trim()) {
      return NextResponse.json({ error: "channel_id och content krävs" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Verify membership
    const { data: member } = await supabase
      .from("chat_channel_members")
      .select("guest_id")
      .eq("channel_id", channel_id)
      .eq("guest_id", session.guest_id)
      .single();

    if (!member) return NextResponse.json({ error: "Ej medlem" }, { status: 403 });

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        channel_id,
        guest_id: session.guest_id,
        content: content.trim(),
      })
      .select("*, guest:guests(name)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
