import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
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
    const rows = await sql.query(
      "SELECT * FROM blogs WHERE slug=$1 AND published=true",
      [params.slug]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ blog: rows[0] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
