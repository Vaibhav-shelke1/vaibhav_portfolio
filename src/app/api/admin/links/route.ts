import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureTable(sql: any) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      url TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'Other',
      description TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = neon(process.env.DATABASE_URL!);
  await ensureTable(sql);
  const rows = await sql.query("SELECT * FROM links ORDER BY category, title");
  return NextResponse.json({ links: rows });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, url, category, description } = await req.json();
  if (!title || !url) return NextResponse.json({ error: "title and url required" }, { status: 400 });
  const sql = neon(process.env.DATABASE_URL!);
  await ensureTable(sql);
  const rows = await sql.query(
    "INSERT INTO links (title, url, category, description) VALUES ($1,$2,$3,$4) RETURNING *",
    [title, url, category ?? "Other", description ?? ""]
  );
  return NextResponse.json({ link: rows[0] }, { status: 201 });
}
