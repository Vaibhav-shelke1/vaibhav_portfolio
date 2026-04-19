import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureTable(sql: any) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT DEFAULT '',
      priority VARCHAR(10) DEFAULT 'medium',
      due_date DATE,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = neon(process.env.DATABASE_URL!);
  await ensureTable(sql);
  const rows = await sql.query(
    "SELECT * FROM todos ORDER BY completed ASC, CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, due_date ASC NULLS LAST"
  );
  return NextResponse.json({ todos: rows });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, priority, due_date } = await req.json();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });
  const sql = neon(process.env.DATABASE_URL!);
  await ensureTable(sql);
  const rows = await sql.query(
    "INSERT INTO todos (title, description, priority, due_date) VALUES ($1,$2,$3,$4) RETURNING *",
    [title, description ?? "", priority ?? "medium", due_date ?? null]
  );
  return NextResponse.json({ todo: rows[0] }, { status: 201 });
}
