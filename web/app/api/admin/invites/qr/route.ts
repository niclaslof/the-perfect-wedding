import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Ej behörig" }, { status: 403 });
  }

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Kod saknas" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://the-perfect-wedding.vercel.app";
  const inviteUrl = `${baseUrl}/invite/${code}`;

  try {
    const svg = await QRCode.toString(inviteUrl, {
      type: "svg",
      width: 256,
      margin: 2,
      color: { dark: "#1c1917", light: "#ffffff" },
    });

    return new NextResponse(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch {
    return NextResponse.json({ error: "Kunde inte generera QR-kod" }, { status: 500 });
  }
}
