import { NextResponse } from "next/server";

export const revalidate = 60; // cache for 60 seconds

export async function GET() {
  try {
    const res = await fetch(
      "https://api.countapi.xyz/hit/vaibhav-shelke-portfolio/visits",
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return NextResponse.json({ count: data.value ?? null });
  } catch {
    return NextResponse.json({ count: null });
  }
}
