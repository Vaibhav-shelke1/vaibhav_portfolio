import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureTable(sql: any) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) UNIQUE NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      tags TEXT[] DEFAULT '{}',
      cover_color VARCHAR(20) DEFAULT '#00ff88',
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = neon(process.env.DATABASE_URL!);
  await ensureTable(sql);
  const rows = await sql.query("SELECT * FROM blogs ORDER BY created_at DESC");
  return NextResponse.json({ blogs: rows });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, slug, excerpt, content, tags, cover_color, published } = await req.json();
  if (!title || !slug || !content) {
    return NextResponse.json({ error: "title, slug and content are required" }, { status: 400 });
  }
  const sql = neon(process.env.DATABASE_URL!);
  await ensureTable(sql);
  const rows = await sql.query(
    `INSERT INTO blogs (title, slug, excerpt, content, tags, cover_color, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, slug, excerpt ?? "", content, tags ?? [], cover_color ?? "#00ff88", published ?? false]
  );
  return NextResponse.json({ blog: rows[0] }, { status: 201 });
}
