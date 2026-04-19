import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, priority, due_date, completed } = await req.json();
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql.query(
    `UPDATE todos SET title=$1, description=$2, priority=$3, due_date=$4, completed=$5, updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [title, description ?? "", priority ?? "medium", due_date ?? null, completed ?? false, params.id]
  );
  return NextResponse.json({ todo: rows[0] });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = neon(process.env.DATABASE_URL!);
  await sql.query("DELETE FROM todos WHERE id=$1", [params.id]);
  return NextResponse.json({ ok: true });
}
