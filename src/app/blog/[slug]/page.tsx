export const dynamic = "force-dynamic";

import Link from "next/link";
import { marked } from "marked";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";

interface Blog {
  id: number; title: string; slug: string; excerpt: string;
  content: string; tags: string[]; cover_color: string; created_at: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql.query(
      "SELECT * FROM blogs WHERE slug=$1 AND published=true",
      [slug]
    );
    return (rows[0] as Blog) ?? null;
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  const html = await marked(blog.content, { breaks: true, gfm: true });

  return (
    <div className="min-h-screen bg-[#010409] font-mono">
      <header className="border-b border-[#1e293b] px-6 py-5 max-w-3xl mx-auto">
        <Link href="/blog" className="text-[#444] text-xs hover:text-[#858585] transition-colors">
          ← All Posts
        </Link>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-10"
        style={{ "--blog-accent": blog.cover_color } as React.CSSProperties}>
        <div className="h-1 w-16 rounded-full mb-8"
          style={{ background: blog.cover_color, boxShadow: `0 0 20px ${blog.cover_color}55` }} />

        <div className="flex flex-wrap gap-2 mb-5">
          {blog.tags?.map((tag) => (
            <span key={tag} className="text-[10px] px-2.5 py-0.5 rounded-full border"
              style={{ color: blog.cover_color, borderColor: `${blog.cover_color}40`, background: `${blog.cover_color}10` }}>
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-[#e2e8f0] font-bold text-3xl sm:text-4xl mb-3 leading-tight">
          {blog.title}
        </h1>

        <p className="text-[#333] text-xs mb-10">
          {new Date(blog.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          <span className="mx-2">·</span>
          Vaibhav Shelke
        </p>

        {blog.excerpt && (
          <p className="text-[#858585] text-base leading-relaxed border-l-2 pl-4 mb-8 italic"
            style={{ borderColor: blog.cover_color }}>
            {blog.excerpt}
          </p>
        )}

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}
