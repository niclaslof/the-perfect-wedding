import { NextResponse } from "next/server";
import { createServerClient } from "@/app/lib/supabase-server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const supabase = createServerClient();

  // Get channels this guest is a member of
  const { data: memberships } = await supabase
    .from("chat_channel_members")
    .select("channel_id")
    .eq("guest_id", session.guest_id);

  const channelIds = memberships?.map((m) => m.channel_id) || [];

  if (channelIds.length === 0) {
    return NextResponse.json({ channels: [] });
  }

  const { data: channels } = await supabase
    .from("chat_channels")
    .select("*")
    .in("id", channelIds)
    .order("created_at", { ascending: true });

  // For DMs, get the other member's name
  const dmChannels = (channels || []).filter((c) => c.channel_type === "dm");
  const enrichedChannels = await Promise.all(
    (channels || []).map(async (ch) => {
      if (ch.channel_type === "dm") {
        const { data: members } = await supabase
          .from("chat_channel_members")
          .select("guest_id, guest:guests(name)")
          .eq("channel_id", ch.id)
          .neq("guest_id", session.guest_id);
        const otherName = (members?.[0] as unknown as { guest: { name: string } })?.guest?.name;
        return { ...ch, display_name: otherName || "DM" };
      }
      return { ...ch, display_name: ch.name || "Gruppchatt" };
    })
  );

  return NextResponse.json({ channels: enrichedChannels });
}
