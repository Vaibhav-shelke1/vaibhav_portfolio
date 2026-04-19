import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql.query(
    "SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC"
  );
  return NextResponse.json({ contacts: rows });
}
