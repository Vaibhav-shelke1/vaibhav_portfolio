import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureTable(sql: any) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      url TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'General',
      description TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = neon(process.env.DATABASE_URL!);
  await ensureTable(sql);
  const rows = await sql.query("SELECT * FROM documents ORDER BY category, created_at DESC");
  return NextResponse.json({ documents: rows });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, url, category, description } = await req.json();
  if (!name || !url) return NextResponse.json({ error: "name and url required" }, { status: 400 });
  const sql = neon(process.env.DATABASE_URL!);
  await ensureTable(sql);
  const rows = await sql.query(
    "INSERT INTO documents (name, url, category, description) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, url, category ?? "General", description ?? ""]
  );
  return NextResponse.json({ document: rows[0] }, { status: 201 });
}
