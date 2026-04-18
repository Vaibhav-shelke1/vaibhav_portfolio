import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.countapi.xyz/hit/vaibhav-shelke-portfolio/visits",
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json({ count: data.value ?? null });
  } catch {
    return NextResponse.json({ count: null });
  }
}
