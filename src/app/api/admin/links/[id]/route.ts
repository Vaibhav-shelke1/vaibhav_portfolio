import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, url, category, description } = await req.json();
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql.query(
    "UPDATE links SET title=$1, url=$2, category=$3, description=$4 WHERE id=$5 RETURNING *",
    [title, url, category ?? "Other", description ?? "", params.id]
  );
  return NextResponse.json({ link: rows[0] });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = neon(process.env.DATABASE_URL!);
  await sql.query("DELETE FROM links WHERE id=$1", [params.id]);
  return NextResponse.json({ ok: true });
}
