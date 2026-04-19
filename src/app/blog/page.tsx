import Link from "next/link";
import { neon } from "@neondatabase/serverless";

interface Blog {
  id: number; title: string; slug: string; excerpt: string;
  tags: string[]; cover_color: string; created_at: string;
}

async function getBlogs(): Promise<Blog[]> {
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
    return rows as Blog[];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[#010409] font-mono">
      <header className="border-b border-[#1e293b] px-6 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <Link href="/" className="text-[#444] text-xs hover:text-[#858585] transition-colors">
            ← vaibhav.shelke
          </Link>
          <h1 className="text-[#e2e8f0] font-bold text-xl mt-1">
            &gt;_ <span style={{ color: "#00ff88" }}>blog</span>
          </h1>
        </div>
        <p className="text-[#333] text-xs">{blogs.length} post{blogs.length !== 1 ? "s" : ""}</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-[#444] font-mono">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {blogs.map((blog, i) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}
                className="group block bg-[#0d1117] border border-[#1e293b] rounded-xl p-6 hover:border-[rgba(0,255,136,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.05)]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="h-0.5 w-12 rounded-full mb-5 transition-all duration-300 group-hover:w-24"
                  style={{ background: blog.cover_color }} />

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {blog.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border"
                      style={{ color: blog.cover_color, borderColor: `${blog.cover_color}33`, background: `${blog.cover_color}0d` }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-[#e2e8f0] font-bold text-base mb-2 group-hover:text-white transition-colors leading-snug">
                  {blog.title}
                </h2>

                {blog.excerpt && (
                  <p className="text-[#555] text-sm leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1a2332]">
                  <span className="text-[#333] text-[10px]">
                    {new Date(blog.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <span className="text-[10px] transition-colors" style={{ color: blog.cover_color }}>
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
