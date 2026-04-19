import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
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
      "SELECT id, title, slug, excerpt, tags, cover_color, created_at FROM blogs WHERE published=true ORDER BY created_at DESC"
    );
    return NextResponse.json({ blogs: rows }, { next: { revalidate: 60 } } as never);
  } catch {
    return NextResponse.json({ blogs: [] });
  }
}
