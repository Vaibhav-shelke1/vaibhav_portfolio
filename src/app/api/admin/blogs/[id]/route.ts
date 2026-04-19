import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, slug, excerpt, content, tags, cover_color, published } = await req.json();
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql.query(
    `UPDATE blogs SET title=$1, slug=$2, excerpt=$3, content=$4, tags=$5,
     cover_color=$6, published=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
    [title, slug, excerpt, content, tags, cover_color, published, params.id]
  );
  return NextResponse.json({ blog: rows[0] });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = neon(process.env.DATABASE_URL!);
  await sql.query("DELETE FROM blogs WHERE id=$1", [params.id]);
  return NextResponse.json({ success: true });
}
