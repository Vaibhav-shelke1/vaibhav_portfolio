"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { marked } from "marked";
import {
  LayoutDashboard, Mail, FileText, Link2, FolderOpen, CheckSquare,
  LogOut, Plus, Pencil, Trash2, Eye, Search, ExternalLink, Bell,
  ChevronDown, ChevronUp, X, Check, Calendar, AlertCircle, Copy,
  Loader2, Menu, Clock, Zap, Globe, BookOpen, Shield, Tag,
  ArrowUpRight, RefreshCw, Star
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
interface Contact { id: number; name: string; email: string; message: string; created_at: string; }
interface Blog {
  id: number; title: string; slug: string; excerpt: string;
  content: string; tags: string[]; cover_color: string;
  published: boolean; created_at: string; updated_at: string;
}
interface AppLink { id: number; title: string; url: string; category: string; description: string; created_at: string; }
interface Doc { id: number; name: string; url: string; category: string; description: string; created_at: string; }
interface Todo { id: number; title: string; description: string; priority: string; due_date: string | null; completed: boolean; created_at: string; }

type TabId = "dashboard" | "contacts" | "blogs" | "links" | "documents" | "todos";

/* ─── Constants ─────────────────────────────────────────── */
const BLOG_COLORS = ["#00ff88", "#00d4ff", "#9d4edd", "#ffd32a", "#ff4757", "#f89f1b"];

const LINK_CATEGORIES = ["Social", "Dev", "Portfolio", "Content", "Productivity", "Learning", "News", "Tools", "Other"];
const DOC_CATEGORIES = ["General", "Resume", "Certificate", "Portfolio", "Design", "Reference", "Personal", "Other"];
const PRIORITY_CONFIG = {
  high:   { color: "#ff4757", bg: "rgba(255,71,87,0.1)",  border: "rgba(255,71,87,0.25)",  label: "High"   },
  medium: { color: "#ffd32a", bg: "rgba(255,211,42,0.1)", border: "rgba(255,211,42,0.25)", label: "Medium" },
  low:    { color: "#00ff88", bg: "rgba(0,255,136,0.1)",  border: "rgba(0,255,136,0.25)",  label: "Low"    },
};

const QUICK_LINKS = [
  { label: "GitHub",    url: "https://github.com/Vaibhav-shelke1",                       icon: <Globe size={16}/>,    color: "#e2e8f0" },
  { label: "LinkedIn",  url: "https://www.linkedin.com/in/vaibhav-shelke-264ba22b7",     icon: <ArrowUpRight size={16}/>, color: "#00d4ff" },
  { label: "LeetCode",  url: "https://leetcode.com/u/Vaibhav_Shelke1/",                 icon: <Zap size={16}/>,      color: "#f89f1b" },
  { label: "Portfolio", url: "/",                                                          icon: <Star size={16}/>,     color: "#00ff88" },
  { label: "npm",       url: "https://www.npmjs.com",                                     icon: <Tag size={16}/>,      color: "#ff4757" },
  { label: "MDN Docs",  url: "https://developer.mozilla.org",                             icon: <BookOpen size={16}/>, color: "#9d4edd" },
  { label: "Regex101",  url: "https://regex101.com",                                      icon: <Shield size={16}/>,   color: "#00d4ff" },
  { label: "Vercel",    url: "https://vercel.com/dashboard",                              icon: <ArrowUpRight size={16}/>, color: "#e2e8f0" },
  { label: "Neon DB",   url: "https://console.neon.tech",                                 icon: <Globe size={16}/>,    color: "#00ff88" },
  { label: "Blog →",    url: "/blog",                                                      icon: <FileText size={16}/>, color: "#9d4edd" },
];

const NAV_ITEMS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard",  icon: <LayoutDashboard size={16} /> },
  { id: "contacts",  label: "Contacts",   icon: <Mail size={16} /> },
  { id: "blogs",     label: "Blogs",      icon: <FileText size={16} /> },
  { id: "links",     label: "Links",      icon: <Link2 size={16} /> },
  { id: "documents", label: "Documents",  icon: <FolderOpen size={16} /> },
  { id: "todos",     label: "Todos",      icon: <CheckSquare size={16} /> },
];

/* ─── Shared UI ─────────────────────────────────────────── */
function Btn({ children, onClick, variant = "ghost", size = "sm", disabled, className = "" }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "danger" | "ghost" | "outline"; size?: "sm" | "xs";
  disabled?: boolean; className?: string;
}) {
  const base = "inline-flex items-center gap-1.5 font-mono transition-all disabled:opacity-40 rounded";
  const sizes = { sm: "px-3 py-1.5 text-xs", xs: "px-2 py-1 text-[10px]" };
  const variants = {
    primary: "bg-[#00ff88] text-[#010409] font-bold hover:opacity-90",
    danger:  "text-[rgba(255,71,87,0.7)] hover:text-[#ff4757] hover:bg-[rgba(255,71,87,0.08)] border border-transparent hover:border-[rgba(255,71,87,0.2)]",
    ghost:   "text-[#555] hover:text-[#858585]",
    outline: "border border-[rgba(0,255,136,0.3)] text-[#00ff88] hover:bg-[rgba(0,255,136,0.08)]",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", required }: {
  label?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1">
      {label && <label className="text-[#00d4ff] text-[10px] font-mono block">{label}{required && <span className="text-[#ff4757] ml-0.5">*</span>}</label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#010409] border border-[#1e293b] rounded-lg px-3 py-2 text-sm font-mono text-[#e2e8f0] placeholder:text-[#2a3444] focus:outline-none focus:border-[rgba(0,255,136,0.4)] focus:ring-1 focus:ring-[rgba(0,255,136,0.1)] transition-all" />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label?: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="space-y-1">
      {label && <label className="text-[#00d4ff] text-[10px] font-mono block">{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#010409] border border-[#1e293b] rounded-lg px-3 py-2 text-sm font-mono text-[#e2e8f0] focus:outline-none focus:border-[rgba(0,255,136,0.4)] transition-all">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border"
      style={{ color, borderColor: `${color}33`, background: `${color}0d` }}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-[#0d1117] border border-[#1e293b] rounded-xl ${className}`}>{children}</div>;
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-center">
      <div className="text-[#2a3444]">{icon}</div>
      <p className="text-[#333] text-sm font-mono">{text}</p>
    </div>
  );
}

/* ─── Confirm Dialog ─────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#0d1117] border border-[#1e293b] rounded-xl p-6 w-full max-w-sm shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(255,71,87,0.1)] border border-[rgba(255,71,87,0.2)] flex items-center justify-center flex-shrink-0">
            <Trash2 size={14} className="text-[#ff4757]" />
          </div>
          <div>
            <p className="text-[#e2e8f0] text-sm font-mono font-bold mb-1">Confirm Delete</p>
            <p className="text-[#555] text-xs font-mono leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onConfirm}
            className="flex-1 py-2 bg-[rgba(255,71,87,0.12)] border border-[rgba(255,71,87,0.3)] text-[#ff4757] text-xs font-mono font-bold rounded-lg hover:bg-[rgba(255,71,87,0.2)] transition-all flex items-center justify-center gap-1.5">
            <Trash2 size={11} /> Delete
          </button>
          <button onClick={onCancel}
            className="flex-1 py-2 bg-[#111827] border border-[#1e293b] text-[#555] text-xs font-mono rounded-lg hover:text-[#858585] hover:border-[#2a3444] transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Markdown Preview ──────────────────────────────────── */
function MarkdownPreview({ content, color }: { content: string; color: string }) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    const result = marked(content, { breaks: true, gfm: true });
    if (result instanceof Promise) result.then(setHtml);
    else setHtml(result);
  }, [content]);

  return (
    <div className="h-full overflow-y-auto p-4"
      style={{ "--md-accent": color } as React.CSSProperties}>
      <div className="md-preview"
        dangerouslySetInnerHTML={{ __html: html || "<p style='color:#2a3444'>Start typing to see preview...</p>" }} />
    </div>
  );
}

/* ─── Blog Form ─────────────────────────────────────────── */
function BlogForm({ initial, onSave, onCancel, adminKey }: {
  initial?: Blog | null; onSave: () => void; onCancel: () => void; adminKey: string;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "", slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "", content: initial?.content ?? "",
    tags: initial?.tags?.join(", ") ?? "", cover_color: initial?.cover_color ?? "#00ff88",
    published: initial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) { setError("Title, slug and content are required"); return; }
    setSaving(true); setError("");
    const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const url = initial ? `/api/admin/blogs/${initial.id}` : "/api/admin/blogs";
    const res = await fetch(url, {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) onSave(); else setError("Save failed. Check console.");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-mono font-bold text-[#e2e8f0] flex items-center gap-2">
          {initial ? <><Pencil size={14} /> Edit Post</> : <><Plus size={14} /> New Post</>}
        </h3>
        <div className="flex gap-2">
          <Btn variant="outline" size="xs" onClick={() => setPreview((v) => !v)}>
            <Eye size={11} /> {preview ? "Editor" : "Preview"}
          </Btn>
          <Btn variant="ghost" size="xs" onClick={onCancel}><X size={11} /> Cancel</Btn>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[rgba(255,71,87,0.9)] text-xs font-mono px-3 py-2 bg-[rgba(255,71,87,0.06)] border border-[rgba(255,71,87,0.2)] rounded-lg">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Title" required value={form.title}
          onChange={(v) => { set("title", v); if (!initial) set("slug", autoSlug(v)); }} />
        <Input label="Slug" required value={form.slug} onChange={(v) => set("slug", v)} placeholder="my-post-slug" />
      </div>
      <Input label="Excerpt" value={form.excerpt} onChange={(v) => set("excerpt", v)} placeholder="Brief summary..." />

      <div>
        <label className="text-[#00d4ff] text-[10px] font-mono block mb-1.5">Content<span className="text-[#ff4757] ml-0.5">*</span> — Markdown</label>
        <div className={`border border-[#1e293b] rounded-xl overflow-hidden ${preview ? "grid grid-cols-2" : ""}`}
          style={{ height: preview ? 420 : "auto" }}>
          <textarea value={form.content} onChange={(e) => set("content", e.target.value)}
            rows={preview ? undefined : 18}
            className="w-full h-full bg-[#010409] px-4 py-3 text-sm font-mono text-[#9ca3af] focus:outline-none resize-none leading-relaxed"
            style={preview ? { height: "100%", borderRight: "1px solid #1e293b" } : {}}
            placeholder="Write your post in Markdown..." />
          {preview && (
            <div className="bg-[#0d1117] h-full overflow-hidden">
              <div className="px-3 py-1.5 border-b border-[#1e293b] text-[9px] font-mono text-[#333] flex items-center gap-1.5">
                <Eye size={9} /> PREVIEW
              </div>
              <MarkdownPreview content={form.content} color={form.cover_color} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Input label="Tags (comma separated)" value={form.tags} onChange={(v) => set("tags", v)} placeholder="React, Node.js, Tips" />
        <div>
          <label className="text-[#00d4ff] text-[10px] font-mono block mb-1.5">Accent Color</label>
          <div className="flex gap-2 mt-1">
            {BLOG_COLORS.map((c) => (
              <button key={c} onClick={() => set("cover_color", c)}
                className="w-6 h-6 rounded-full border-2 transition-all flex-shrink-0"
                style={{ background: c, borderColor: form.cover_color === c ? "#fff" : "transparent",
                  boxShadow: form.cover_color === c ? `0 0 8px ${c}88` : "none" }} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 pb-0.5">
          <button onClick={() => set("published", !form.published)}
            className={`relative w-10 h-5 rounded-full border transition-all flex-shrink-0 ${form.published ? "bg-[rgba(0,255,136,0.15)] border-[rgba(0,255,136,0.4)]" : "bg-[#0a0e1a] border-[#1e293b]"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${form.published ? "left-5 bg-[#00ff88]" : "left-0.5 bg-[#2a3444]"}`} />
          </button>
          <span className="text-xs font-mono text-[#858585]">{form.published ? "Published" : "Draft"}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <Btn variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : <><Check size={12} /> {initial ? "Update Post" : "Publish Post"}</>}
        </Btn>
        <Btn variant="ghost" onClick={onCancel}><X size={12} /> Cancel</Btn>
      </div>
    </div>
  );
}

/* ─── Link Form ─────────────────────────────────────────── */
function LinkForm({ initial, onSave, onCancel, adminKey }: {
  initial?: AppLink | null; onSave: () => void; onCancel: () => void; adminKey: string;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "", url: initial?.url ?? "",
    category: initial?.category ?? "Other", description: initial?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.url) { setError("Title and URL are required"); return; }
    setSaving(true); setError("");
    const url = initial ? `/api/admin/links/${initial.id}` : "/api/admin/links";
    const res = await fetch(url, {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) onSave(); else setError("Save failed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono font-bold text-[#e2e8f0] flex items-center gap-2 text-sm">
          <Link2 size={14} /> {initial ? "Edit Link" : "Add Link"}
        </h3>
        <Btn variant="ghost" size="xs" onClick={onCancel}><X size={11} /></Btn>
      </div>
      {error && <p className="text-[rgba(255,71,87,0.9)] text-xs font-mono flex items-center gap-1"><AlertCircle size={11} /> {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="Title" required value={form.title} onChange={(v) => set("title", v)} placeholder="My Resource" />
        <Input label="URL" required value={form.url} onChange={(v) => set("url", v)} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select label="Category" value={form.category} onChange={(v) => set("category", v)} options={LINK_CATEGORIES} />
        <Input label="Description" value={form.description} onChange={(v) => set("description", v)} placeholder="Short note..." />
      </div>
      <div className="flex gap-3">
        <Btn variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} {initial ? "Update" : "Add Link"}
        </Btn>
        <Btn variant="ghost" onClick={onCancel}><X size={11} /> Cancel</Btn>
      </div>
    </div>
  );
}

/* ─── Document Form ─────────────────────────────────────── */
function DocForm({ initial, onSave, onCancel, adminKey }: {
  initial?: Doc | null; onSave: () => void; onCancel: () => void; adminKey: string;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "", url: initial?.url ?? "",
    category: initial?.category ?? "General", description: initial?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.url) { setError("Name and URL are required"); return; }
    setSaving(true); setError("");
    const url = initial ? `/api/admin/documents/${initial.id}` : "/api/admin/documents";
    const res = await fetch(url, {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) onSave(); else setError("Save failed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono font-bold text-[#e2e8f0] flex items-center gap-2 text-sm">
          <FolderOpen size={14} /> {initial ? "Edit Document" : "Add Document"}
        </h3>
        <Btn variant="ghost" size="xs" onClick={onCancel}><X size={11} /></Btn>
      </div>
      {error && <p className="text-[rgba(255,71,87,0.9)] text-xs font-mono flex items-center gap-1"><AlertCircle size={11} /> {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="Document Name" required value={form.name} onChange={(v) => set("name", v)} placeholder="My Resume" />
        <Input label="URL (Google Drive, Dropbox, etc.)" required value={form.url} onChange={(v) => set("url", v)} placeholder="https://drive.google.com/..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select label="Category" value={form.category} onChange={(v) => set("category", v)} options={DOC_CATEGORIES} />
        <Input label="Notes" value={form.description} onChange={(v) => set("description", v)} placeholder="Short description..." />
      </div>
      <div className="flex gap-3">
        <Btn variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} {initial ? "Update" : "Add Document"}
        </Btn>
        <Btn variant="ghost" onClick={onCancel}><X size={11} /> Cancel</Btn>
      </div>
    </div>
  );
}

/* ─── Todo Form ─────────────────────────────────────────── */
function TodoForm({ initial, onSave, onCancel, adminKey }: {
  initial?: Todo | null; onSave: () => void; onCancel: () => void; adminKey: string;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "", description: initial?.description ?? "",
    priority: initial?.priority ?? "medium",
    due_date: initial?.due_date ? initial.due_date.split("T")[0] : "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    const url = initial ? `/api/admin/todos/${initial.id}` : "/api/admin/todos";
    const payload = { ...form, due_date: form.due_date || null, completed: initial?.completed ?? false };
    const res = await fetch(url, {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) onSave();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono font-bold text-[#e2e8f0] flex items-center gap-2 text-sm">
          <CheckSquare size={14} /> {initial ? "Edit Todo" : "Add Todo"}
        </h3>
        <Btn variant="ghost" size="xs" onClick={onCancel}><X size={11} /></Btn>
      </div>
      <Input label="Task Title" required value={form.title} onChange={(v) => set("title", v)} placeholder="What needs to be done?" />
      <Input label="Description" value={form.description} onChange={(v) => set("description", v)} placeholder="Details..." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select label="Priority" value={form.priority} onChange={(v) => set("priority", v)} options={["high", "medium", "low"]} />
        <Input label="Due Date" type="date" value={form.due_date} onChange={(v) => set("due_date", v)} />
      </div>
      <div className="flex gap-3">
        <Btn variant="primary" onClick={handleSave} disabled={saving || !form.title}>
          {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} {initial ? "Update" : "Add Task"}
        </Btn>
        <Btn variant="ghost" onClick={onCancel}><X size={11} /> Cancel</Btn>
      </div>
    </div>
  );
}

/* ─── Admin Page ─────────────────────────────────────────── */
export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [contacts, setContacts]   = useState<Contact[]>([]);
  const [blogs, setBlogs]         = useState<Blog[]>([]);
  const [links, setLinks]         = useState<AppLink[]>([]);
  const [docs, setDocs]           = useState<Doc[]>([]);
  const [todos, setTodos]         = useState<Todo[]>([]);

  const [loading, setLoading]     = useState(false);
  const [adminKey, setAdminKey]   = useState("");

  const [editBlog, setEditBlog]   = useState<Blog | null | "new">(null);
  const [editLink, setEditLink]   = useState<AppLink | null | "new">(null);
  const [editDoc, setEditDoc]     = useState<Doc | null | "new">(null);
  const [editTodo, setEditTodo]   = useState<Todo | null | "new">(null);

  const [expandedContact, setExpandedContact] = useState<number | null>(null);
  const [search, setSearch]       = useState("");
  const [linkSearch, setLinkSearch] = useState("");
  const [seeding, setSeeding]     = useState(false);
  const [seedMsg, setSeedMsg]     = useState("");
  const [copied, setCopied]       = useState<number | null>(null);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>("default");
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installDismissed, setInstallDismissed] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_key");
    if (saved) { setAdminKey(saved); setAuthed(true); }
    if ("Notification" in window) setNotifPerm(Notification.permission);
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const login = async () => {
    setAuthLoading(true);
    const res = await fetch("/api/admin/contacts", { headers: { "x-admin-key": key } });
    setAuthLoading(false);
    if (res.ok) { sessionStorage.setItem("admin_key", key); setAdminKey(key); setAuthed(true); }
    else setAuthError(true);
  };

  const fetchAll = useCallback(async (k: string) => {
    setLoading(true);
    const [cr, br, lr, dr, tr] = await Promise.all([
      fetch("/api/admin/contacts",  { headers: { "x-admin-key": k } }).then((r) => r.json()),
      fetch("/api/admin/blogs",     { headers: { "x-admin-key": k } }).then((r) => r.json()),
      fetch("/api/admin/links",     { headers: { "x-admin-key": k } }).then((r) => r.json()),
      fetch("/api/admin/documents", { headers: { "x-admin-key": k } }).then((r) => r.json()),
      fetch("/api/admin/todos",     { headers: { "x-admin-key": k } }).then((r) => r.json()),
    ]);
    setContacts(cr.contacts ?? []);
    setBlogs(br.blogs ?? []);
    setLinks(lr.links ?? []);
    setDocs(dr.documents ?? []);
    setTodos(tr.todos ?? []);
    setLoading(false);
  }, []);

  const refetch = useCallback((type: "contacts" | "blogs" | "links" | "documents" | "todos") => {
    const map: Record<string, string> = { contacts: "/api/admin/contacts", blogs: "/api/admin/blogs", links: "/api/admin/links", documents: "/api/admin/documents", todos: "/api/admin/todos" };
    fetch(map[type], { headers: { "x-admin-key": adminKey } })
      .then((r) => r.json())
      .then((d) => {
        if (type === "contacts")  setContacts(d.contacts ?? []);
        if (type === "blogs")     setBlogs(d.blogs ?? []);
        if (type === "links")     setLinks(d.links ?? []);
        if (type === "documents") setDocs(d.documents ?? []);
        if (type === "todos")     setTodos(d.todos ?? []);
      });
  }, [adminKey]);

  useEffect(() => { if (authed) fetchAll(adminKey); }, [authed, adminKey, fetchAll]);

  const deleteItem = (endpoint: string, type: "blogs" | "links" | "documents" | "todos", label: string) => {
    setConfirmDialog({
      message: `"${label}" will be permanently removed. This cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        await fetch(endpoint, { method: "DELETE", headers: { "x-admin-key": adminKey } });
        refetch(type);
      },
    });
  };

  const toggleTodo = async (todo: Todo) => {
    await fetch(`/api/admin/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    });
    refetch("todos");
  };

  const seedBlogs = async () => {
    setSeeding(true); setSeedMsg("");
    const res = await fetch("/api/admin/seed", { method: "POST", headers: { "x-admin-key": adminKey } });
    const data = await res.json();
    const inserted = data.results?.filter((r: { inserted: boolean }) => r.inserted).length ?? 0;
    setSeedMsg(inserted > 0 ? `✓ ${inserted} posts seeded` : "Already exists — no duplicates");
    setSeeding(false);
    refetch("blogs");
  };

  const requestNotifications = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifPerm(perm);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const filteredContacts = useMemo(() =>
    contacts.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase())
    ), [contacts, search]);

  const filteredLinks = useMemo(() =>
    links.filter((l) =>
      l.title.toLowerCase().includes(linkSearch.toLowerCase()) ||
      l.category.toLowerCase().includes(linkSearch.toLowerCase()) ||
      l.url.toLowerCase().includes(linkSearch.toLowerCase())
    ), [links, linkSearch]);

  const stats = {
    contacts:  contacts.length,
    published: blogs.filter((b) => b.published).length,
    drafts:    blogs.filter((b) => !b.published).length,
    links:     links.length,
    docs:      docs.length,
    pending:   todos.filter((t) => !t.completed).length,
    overdue:   todos.filter((t) => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length,
  };

  const navBadge: Partial<Record<TabId, number | undefined>> = {
    contacts:  stats.contacts  || undefined,
    blogs:     (stats.published + stats.drafts) || undefined,
    links:     stats.links     || undefined,
    documents: stats.docs      || undefined,
    todos:     stats.pending   || undefined,
  };

  /* ── Confirm Dialog ── */
  const confirmEl = confirmDialog ? (
    <ConfirmDialog
      message={confirmDialog.message}
      onConfirm={confirmDialog.onConfirm}
      onCancel={() => setConfirmDialog(null)}
    />
  ) : null;

  /* ── Login ── */
  if (!authed) {
    return (
      <>
        {confirmEl}
        <div className="min-h-screen bg-[#010409] flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0d1117] border border-[#1e293b] rounded-2xl mb-4">
                <span className="text-[#00ff88] text-2xl font-bold">&gt;_</span>
              </div>
              <h1 className="text-[#e2e8f0] font-bold text-lg">Admin Panel</h1>
              <p className="text-[#333] text-xs mt-1">vaibhav.portfolio / restricted</p>
            </div>
            <Card className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[#555] text-[10px] font-mono flex items-center gap-1.5">
                  <Shield size={10} /> ADMIN KEY
                </label>
                <input type="password" value={key}
                  onChange={(e) => { setKey(e.target.value); setAuthError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && !authLoading && login()}
                  placeholder="Enter your admin key..."
                  className="w-full bg-[#010409] border border-[#1e293b] rounded-lg px-3 py-2.5 text-sm text-[#e2e8f0] font-mono placeholder:text-[#2a3444] focus:outline-none focus:border-[rgba(0,255,136,0.4)] focus:ring-1 focus:ring-[rgba(0,255,136,0.1)] transition-all" />
                {authError && (
                  <p className="text-[rgba(255,71,87,0.8)] text-xs flex items-center gap-1.5">
                    <AlertCircle size={11} /> Invalid key. Try again.
                  </p>
                )}
              </div>
              <button onClick={login} disabled={authLoading || !key}
                className="w-full py-2.5 bg-[#00ff88] text-[#010409] font-mono font-bold text-sm rounded-lg hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                {authLoading ? <><Loader2 size={14} className="animate-spin" /> Verifying...</> : "Access Dashboard"}
              </button>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#010409] border border-[rgba(0,255,136,0.3)] rounded-lg flex items-center justify-center text-[#00ff88] text-xs font-bold">&gt;_</div>
          <div>
            <p className="text-[#e2e8f0] text-xs font-bold font-mono">admin</p>
            <p className="text-[#333] text-[9px] font-mono">vaibhav.portfolio</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all group ${
              tab === item.id
                ? "bg-[rgba(0,255,136,0.08)] text-[#00ff88] border border-[rgba(0,255,136,0.15)]"
                : "text-[#444] hover:text-[#858585] hover:bg-[#111827]"
            }`}>
            <span className="flex items-center gap-2.5">
              <span className={tab === item.id ? "text-[#00ff88]" : "text-[#333] group-hover:text-[#555]"}>{item.icon}</span>
              {item.label}
            </span>
            {navBadge[item.id] !== undefined && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                tab === item.id ? "bg-[rgba(0,255,136,0.15)] text-[#00ff88]" : "bg-[#1e293b] text-[#555]"
              }`}>{navBadge[item.id]}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-[#1e293b]">
        <button onClick={() => { sessionStorage.removeItem("admin_key"); setAuthed(false); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[#333] hover:text-[rgba(255,71,87,0.7)] hover:bg-[rgba(255,71,87,0.05)] transition-all">
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
    {confirmEl}

    {/* Install banner */}
    {installPrompt && !installDismissed && (
      <div className="fixed top-0 left-0 right-0 z-[100] md:hidden bg-[#0a0e1a] border-b border-[rgba(0,255,136,0.2)] px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 bg-[#010409] border border-[rgba(0,255,136,0.3)] rounded-lg flex items-center justify-center text-[#00ff88] text-xs font-bold flex-shrink-0">&gt;_</div>
        <div className="flex-1 min-w-0">
          <p className="text-[#e2e8f0] text-xs font-mono font-bold">Install as App</p>
          <p className="text-[#333] text-[10px] font-mono">Add to home screen for the best experience</p>
        </div>
        <button onClick={async () => { installPrompt.prompt(); const r = await installPrompt.userChoice; if (r.outcome === "accepted") setInstallPrompt(null); }}
          className="text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg bg-[#00ff88] text-[#010409] flex-shrink-0">
          Install
        </button>
        <button onClick={() => setInstallDismissed(true)} className="text-[#333] hover:text-[#555] flex-shrink-0">
          <X size={14} />
        </button>
      </div>
    )}

    <div className="min-h-screen bg-[#010409] font-mono text-[#e2e8f0] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 flex-col border-r border-[#1e293b] sticky top-0 h-screen bg-[#0a0e1a]">
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top status bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-[#1e293b] bg-[#010409] sticky top-0 z-40">
          <span className="text-[#00ff88] font-bold text-xs font-mono">&gt;_ {tab}</span>
          <button onClick={() => { sessionStorage.removeItem("admin_key"); setAuthed(false); }}
            className="text-[#2a3444] hover:text-[rgba(255,71,87,0.7)] transition-colors p-1">
            <LogOut size={14} />
          </button>
        </div>

        <main className="flex-1 p-4 md:p-7 overflow-y-auto pb-24 md:pb-7">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* ── Dashboard ── */}
            {tab === "dashboard" && (
              <>
                <div>
                  <h2 className="text-[#e2e8f0] font-bold text-base flex items-center gap-2 mb-1">
                    <LayoutDashboard size={16} className="text-[#00ff88]" /> Dashboard
                  </h2>
                  <p className="text-[#333] text-xs">Welcome back. Here&apos;s your overview.</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Contacts",     value: stats.contacts,  color: "#00d4ff", icon: <Mail size={14}/>        },
                    { label: "Published",    value: stats.published, color: "#00ff88", icon: <FileText size={14}/>    },
                    { label: "Draft Posts",  value: stats.drafts,    color: "#ffd32a", icon: <FileText size={14}/>    },
                    { label: "Links Saved",  value: stats.links,     color: "#9d4edd", icon: <Link2 size={14}/>       },
                    { label: "Documents",    value: stats.docs,      color: "#f89f1b", icon: <FolderOpen size={14}/>  },
                    { label: "Pending Tasks",value: stats.pending,   color: "#00ff88", icon: <CheckSquare size={14}/> },
                    ...(stats.overdue > 0 ? [{ label: "Overdue", value: stats.overdue, color: "#ff4757", icon: <AlertCircle size={14}/> }] : []),
                  ].map((s) => (
                    <Card key={s.label} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                          <p className="text-[#444] text-[10px] mt-0.5">{s.label}</p>
                        </div>
                        <span style={{ color: `${s.color}44` }}>{s.icon}</span>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Quick links */}
                <div>
                  <p className="text-[#333] text-[10px] mb-3 flex items-center gap-1.5"><Zap size={10} /> quick_links</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {QUICK_LINKS.map((tool) => (
                      <a key={tool.label} href={tool.url} target={tool.url.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 p-3 bg-[#0d1117] border border-[#1e293b] rounded-xl hover:border-[#2a3444] hover:bg-[#111827] transition-all group text-center">
                        <span className="text-[#444] group-hover:text-[#858585] transition-colors">{tool.icon}</span>
                        <span className="text-[9px] text-[#333] group-hover:text-[#555] transition-colors truncate w-full text-center">{tool.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Notifications card — hidden once granted */}
                {notifPerm !== "granted" && (
                  <Card className="p-5">
                    <p className="text-[#333] text-[10px] mb-2 flex items-center gap-1.5"><Bell size={10} /> notifications</p>
                    <p className="text-[#858585] text-xs mb-3 leading-relaxed">Enable to get todo due-date reminders in the browser.</p>
                    <Btn variant="outline" onClick={requestNotifications}>
                      <Bell size={11} /> Enable Notifications
                    </Btn>
                  </Card>
                )}

                {/* Recent contacts */}
                {contacts.length > 0 && (
                  <div>
                    <p className="text-[#333] text-[10px] mb-3 flex items-center gap-1.5"><Mail size={10} /> recent_contacts</p>
                    <Card>
                      {contacts.slice(0, 4).map((c, i) => (
                        <div key={c.id} className={`flex items-center gap-4 px-4 py-3 text-xs ${i < 3 ? "border-b border-[#1e293b]" : ""}`}>
                          <span className="text-[#e2e8f0] w-28 truncate flex-shrink-0">{c.name}</span>
                          <span className="text-[#00d4ff] flex-1 truncate">{c.email}</span>
                          <span className="text-[#333] flex-shrink-0">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </Card>
                  </div>
                )}
              </>
            )}

            {/* ── Contacts ── */}
            {tab === "contacts" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
                    <Mail size={16} className="text-[#00d4ff]" /> Contacts
                    <span className="text-[#333] text-xs font-normal">({contacts.length})</span>
                  </h2>
                  <div className="relative">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="bg-[#0d1117] border border-[#1e293b] rounded-lg pl-8 pr-4 py-2 text-xs text-[#e2e8f0] placeholder:text-[#333] focus:outline-none focus:border-[rgba(0,255,136,0.3)] w-56 transition-all" />
                  </div>
                </div>

                {loading && <div className="flex items-center gap-2 text-[#333] text-xs"><Loader2 size={12} className="animate-spin" /> Loading...</div>}

                {!loading && filteredContacts.length === 0 && (
                  <EmptyState icon={<Mail size={40} />} text="No contacts yet." />
                )}

                {!loading && filteredContacts.length > 0 && (
                  <>
                    {/* Mobile: card list */}
                    <div className="md:hidden space-y-2">
                      {filteredContacts.map((c) => (
                        <Card key={c.id} className="overflow-hidden">
                          <button className="w-full text-left px-4 py-3.5 flex items-start justify-between gap-3"
                            onClick={() => setExpandedContact(expandedContact === c.id ? null : c.id)}>
                            <div className="min-w-0 flex-1">
                              <p className="text-[#e2e8f0] text-sm font-medium truncate">{c.name}</p>
                              <p className="text-[#00d4ff] text-xs mt-0.5 truncate">{c.email}</p>
                              <p className="text-[#333] text-[10px] mt-1">
                                {new Date(c.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              </p>
                            </div>
                            <span className="text-[#2a3444] flex-shrink-0 mt-1">
                              {expandedContact === c.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </span>
                          </button>
                          {expandedContact === c.id && (
                            <div className="px-4 pb-4 pt-1 bg-[#010409] border-t border-[#1e293b]">
                              <p className="text-[#858585] text-xs leading-relaxed whitespace-pre-wrap">{c.message}</p>
                              <a href={`mailto:${c.email}?subject=Re: Your message&body=Hi ${c.name},%0A%0A`}
                                className="inline-flex items-center gap-1.5 mt-3 text-[10px] px-3 py-2 rounded-lg border border-[rgba(0,212,255,0.3)] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)] transition-all">
                                <ArrowUpRight size={10} /> Reply via Email
                              </a>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>

                    {/* Desktop: table */}
                    <Card className="hidden md:block overflow-hidden">
                      <div className="grid grid-cols-[auto_1fr_1.5fr_110px_80px] gap-0 bg-[#111827] border-b border-[#1e293b] text-[9px] text-[#444] px-4 py-2.5 uppercase tracking-wider">
                        <span className="w-7">#</span><span>Name</span><span>Email</span><span>Date</span><span>Action</span>
                      </div>
                      {filteredContacts.map((c, i) => (
                        <div key={c.id} className="border-b border-[#1e293b] last:border-0">
                          <div className="grid grid-cols-[auto_1fr_1.5fr_110px_80px] gap-0 px-4 py-3 text-xs cursor-pointer hover:bg-[#111827] transition-colors items-center"
                            onClick={() => setExpandedContact(expandedContact === c.id ? null : c.id)}>
                            <span className="text-[#333] w-7 text-[10px]">{i + 1}</span>
                            <span className="text-[#e2e8f0] truncate pr-3">{c.name}</span>
                            <span className="text-[#00d4ff] truncate pr-3">{c.email}</span>
                            <span className="text-[#333] text-[10px]">{new Date(c.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}</span>
                            <span className="text-[#333]">{expandedContact === c.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>
                          </div>
                          {expandedContact === c.id && (
                            <div className="px-4 pb-4 pt-2 bg-[#010409] border-t border-[#1e293b]">
                              <p className="text-[#858585] text-xs leading-relaxed whitespace-pre-wrap">{c.message}</p>
                              <a href={`mailto:${c.email}?subject=Re: Your message&body=Hi ${c.name},%0A%0A`}
                                className="inline-flex items-center gap-1.5 mt-3 text-[10px] px-3 py-1.5 rounded-lg border border-[rgba(0,212,255,0.3)] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)] transition-all">
                                <ArrowUpRight size={10} /> Reply via Email
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* ── Blogs ── */}
            {tab === "blogs" && (
              <div className="space-y-5">
                {editBlog ? (
                  <Card className="p-6">
                    <BlogForm
                      initial={editBlog === "new" ? null : editBlog}
                      adminKey={adminKey}
                      onSave={() => { setEditBlog(null); refetch("blogs"); }}
                      onCancel={() => setEditBlog(null)} />
                  </Card>
                ) : (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
                        <FileText size={16} className="text-[#9d4edd]" /> Blogs
                        <span className="text-[#333] text-xs font-normal">({stats.published} live · {stats.drafts} draft)</span>
                      </h2>
                      <div className="flex items-center gap-3">
                        <a href="/blog" target="_blank" className="text-[10px] text-[#444] hover:text-[#858585] flex items-center gap-1 transition-colors">
                          <ExternalLink size={10} /> public blog
                        </a>
                        <Btn variant="outline" onClick={() => setEditBlog("new")}><Plus size={12} /> New Post</Btn>
                      </div>
                    </div>

                    {loading && <div className="flex items-center gap-2 text-[#333] text-xs"><Loader2 size={12} className="animate-spin" /> Loading...</div>}

                    {!loading && blogs.length === 0 && (
                      <EmptyState icon={<FileText size={40} />} text="No posts yet. Click '+ New Post' to write your first blog." />
                    )}

                    {!loading && blogs.length > 0 && (
                      <>
                        {/* Mobile: blog cards */}
                        <div className="md:hidden space-y-2">
                          {blogs.map((b) => (
                            <Card key={b.id} className="px-4 py-3.5">
                              <div className="flex items-start gap-3">
                                <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: b.cover_color, boxShadow: `0 0 6px ${b.cover_color}66` }} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="text-[#e2e8f0] text-sm font-medium">{b.title}</p>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${b.published ? "text-[#00ff88] bg-[rgba(0,255,136,0.08)] border-[rgba(0,255,136,0.2)]" : "text-[#444] bg-[#0a0e1a] border-[#1e293b]"}`}>
                                      {b.published ? "LIVE" : "DRAFT"}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {b.tags?.slice(0, 3).map((t) => (
                                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[#111827] border border-[#1e293b] text-[#444]">{t}</span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <Btn variant="outline" size="xs" onClick={() => setEditBlog(b)}><Pencil size={10} /> Edit</Btn>
                                    <a href={`/blog/${b.slug}`} target="_blank"
                                      className="text-[10px] text-[#444] hover:text-[#00ff88] flex items-center gap-1 transition-colors">
                                      <Eye size={10} /> View
                                    </a>
                                    <Btn variant="danger" size="xs" onClick={() => deleteItem(`/api/admin/blogs/${b.id}`, "blogs", b.title)}>
                                      <Trash2 size={10} /> Delete
                                    </Btn>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Desktop: table */}
                        <Card className="hidden md:block overflow-hidden">
                          <div className="grid grid-cols-[12px_1fr_120px_80px_100px] gap-4 bg-[#111827] border-b border-[#1e293b] text-[9px] text-[#444] px-4 py-2.5 uppercase tracking-wider">
                            <span /><span>Title</span><span>Tags</span><span>Status</span><span>Actions</span>
                          </div>
                          {blogs.map((b) => (
                            <div key={b.id} className="grid grid-cols-[12px_1fr_120px_80px_100px] gap-4 px-4 py-3.5 text-xs border-b border-[#1e293b] last:border-0 hover:bg-[#111827] transition-colors items-start">
                              <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: b.cover_color, boxShadow: `0 0 6px ${b.cover_color}66` }} />
                              <div>
                                <p className="text-[#e2e8f0] font-medium truncate">{b.title}</p>
                                <p className="text-[#2a3444] text-[10px] mt-0.5">/blog/{b.slug}</p>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {b.tags?.slice(0, 2).map((t) => (
                                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[#111827] border border-[#1e293b] text-[#444]">{t}</span>
                                ))}
                              </div>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold w-fit ${b.published ? "text-[#00ff88] bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.2)]" : "text-[#444] bg-[#0a0e1a] border border-[#1e293b]"}`}>
                                {b.published ? "LIVE" : "DRAFT"}
                              </span>
                              <div className="flex gap-3">
                                <Btn variant="ghost" size="xs" onClick={() => setEditBlog(b)}><Pencil size={10} /></Btn>
                                <a href={`/blog/${b.slug}`} target="_blank" className="text-[#444] hover:text-[#00ff88] transition-colors"><Eye size={10} /></a>
                                <Btn variant="danger" size="xs" onClick={() => deleteItem(`/api/admin/blogs/${b.id}`, "blogs", b.title)}><Trash2 size={10} /></Btn>
                              </div>
                            </div>
                          ))}
                        </Card>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Links ── */}
            {tab === "links" && (
              <div className="space-y-5">
                {editLink ? (
                  <Card className="p-6">
                    <LinkForm
                      initial={editLink === "new" ? null : editLink}
                      adminKey={adminKey}
                      onSave={() => { setEditLink(null); refetch("links"); }}
                      onCancel={() => setEditLink(null)} />
                  </Card>
                ) : (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
                        <Link2 size={16} className="text-[#9d4edd]" /> Link Manager
                        <span className="text-[#333] text-xs font-normal">({links.length})</span>
                      </h2>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#333]" />
                          <input value={linkSearch} onChange={(e) => setLinkSearch(e.target.value)}
                            placeholder="Search links..."
                            className="bg-[#0d1117] border border-[#1e293b] rounded-lg pl-7 pr-3 py-1.5 text-xs text-[#e2e8f0] placeholder:text-[#333] focus:outline-none focus:border-[rgba(0,255,136,0.3)] w-44 transition-all" />
                        </div>
                        <Btn variant="outline" onClick={() => setEditLink("new")}><Plus size={12} /> Add Link</Btn>
                      </div>
                    </div>

                    {links.length === 0 && (
                      <EmptyState icon={<Link2 size={40} />} text="No links saved. Add your first link." />
                    )}

                    {filteredLinks.length > 0 && (
                      <div className="space-y-3">
                        {LINK_CATEGORIES.filter((cat) => filteredLinks.some((l) => l.category === cat)).map((cat) => {
                          const catLinks = filteredLinks.filter((l) => l.category === cat);
                          if (!catLinks.length) return null;
                          return (
                            <div key={cat}>
                              <p className="text-[#333] text-[10px] mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                                <Tag size={9} /> {cat} <span className="text-[#2a3444]">({catLinks.length})</span>
                              </p>
                              <Card className="overflow-hidden">
                                {catLinks.map((l, i) => (
                                  <div key={l.id} className={`flex items-center gap-3 px-4 py-3 text-xs hover:bg-[#111827] transition-colors ${i < catLinks.length - 1 ? "border-b border-[#1e293b]" : ""}`}>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[#e2e8f0] font-medium truncate">{l.title}</p>
                                      {l.description && <p className="text-[#333] text-[10px] mt-0.5 truncate">{l.description}</p>}
                                    </div>
                                    <span className="text-[#2a3444] text-[10px] truncate max-w-[180px] hidden sm:block">{l.url.replace(/^https?:\/\//, "")}</span>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <a href={l.url} target="_blank" rel="noopener noreferrer"
                                        className="text-[#444] hover:text-[#00ff88] transition-colors">
                                        <ExternalLink size={12} />
                                      </a>
                                      <button onClick={() => copyToClipboard(l.url, l.id)}
                                        className="text-[#444] hover:text-[#00d4ff] transition-colors">
                                        {copied === l.id ? <Check size={12} className="text-[#00ff88]" /> : <Copy size={12} />}
                                      </button>
                                      <Btn variant="ghost" size="xs" onClick={() => setEditLink(l)}><Pencil size={10} /></Btn>
                                      <Btn variant="danger" size="xs" onClick={() => deleteItem(`/api/admin/links/${l.id}`, "links", l.title)}><Trash2 size={10} /></Btn>
                                    </div>
                                  </div>
                                ))}
                              </Card>
                            </div>
                          );
                        })}
                        {/* Links whose category doesn't match any known category */}
                        {filteredLinks.filter((l) => !LINK_CATEGORIES.includes(l.category)).length > 0 && (
                          <div>
                            <p className="text-[#333] text-[10px] mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                              <Tag size={9} /> Uncategorized
                            </p>
                            <Card className="overflow-hidden">
                              {filteredLinks.filter((l) => !LINK_CATEGORIES.includes(l.category)).map((l, i, arr) => (
                                <div key={l.id} className={`flex items-center gap-3 px-4 py-3 text-xs hover:bg-[#111827] transition-colors ${i < arr.length - 1 ? "border-b border-[#1e293b]" : ""}`}>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[#e2e8f0] font-medium truncate">{l.title}</p>
                                    {l.description && <p className="text-[#333] text-[10px] mt-0.5 truncate">{l.description}</p>}
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-[#444] hover:text-[#00ff88] transition-colors"><ExternalLink size={12} /></a>
                                    <button onClick={() => copyToClipboard(l.url, l.id)} className="text-[#444] hover:text-[#00d4ff] transition-colors">
                                      {copied === l.id ? <Check size={12} className="text-[#00ff88]" /> : <Copy size={12} />}
                                    </button>
                                    <Btn variant="ghost" size="xs" onClick={() => setEditLink(l)}><Pencil size={10} /></Btn>
                                    <Btn variant="danger" size="xs" onClick={() => deleteItem(`/api/admin/links/${l.id}`, "links", l.title)}><Trash2 size={10} /></Btn>
                                  </div>
                                </div>
                              ))}
                            </Card>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Documents ── */}
            {tab === "documents" && (
              <div className="space-y-5">
                {editDoc ? (
                  <Card className="p-6">
                    <DocForm
                      initial={editDoc === "new" ? null : editDoc}
                      adminKey={adminKey}
                      onSave={() => { setEditDoc(null); refetch("documents"); }}
                      onCancel={() => setEditDoc(null)} />
                  </Card>
                ) : (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
                        <FolderOpen size={16} className="text-[#f89f1b]" /> Document Vault
                        <span className="text-[#333] text-xs font-normal">({docs.length})</span>
                      </h2>
                      <Btn variant="outline" onClick={() => setEditDoc("new")}><Plus size={12} /> Add Document</Btn>
                    </div>

                    <Card className="p-4 bg-[rgba(248,159,27,0.03)] border-[rgba(248,159,27,0.15)]">
                      <p className="text-[#858585] text-xs leading-relaxed flex items-start gap-2">
                        <AlertCircle size={12} className="text-[#f89f1b] flex-shrink-0 mt-0.5" />
                        Store links to your documents on Google Drive, Dropbox, or any cloud storage. The vault keeps them organized — files stay on your cloud.
                      </p>
                    </Card>

                    {docs.length === 0 && (
                      <EmptyState icon={<FolderOpen size={40} />} text="No documents yet. Add a Google Drive or Dropbox link." />
                    )}

                    {docs.length > 0 && (
                      <div className="space-y-3">
                        {DOC_CATEGORIES.filter((cat) => docs.some((d) => d.category === cat)).map((cat) => {
                          const catDocs = docs.filter((d) => d.category === cat);
                          if (!catDocs.length) return null;
                          return (
                            <div key={cat}>
                              <p className="text-[#333] text-[10px] mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                                <FolderOpen size={9} /> {cat}
                              </p>
                              <Card className="overflow-hidden">
                                {catDocs.map((d, i) => (
                                  <div key={d.id} className={`flex items-center gap-3 px-4 py-3 text-xs hover:bg-[#111827] transition-colors ${i < catDocs.length - 1 ? "border-b border-[#1e293b]" : ""}`}>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[#e2e8f0] font-medium truncate">{d.name}</p>
                                      {d.description && <p className="text-[#333] text-[10px] mt-0.5">{d.description}</p>}
                                      <p className="text-[#2a3444] text-[9px] mt-0.5 truncate">{d.url.replace(/^https?:\/\//, "")}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <a href={d.url} target="_blank" rel="noopener noreferrer"
                                        className="text-[#444] hover:text-[#00ff88] transition-colors text-[10px] flex items-center gap-1">
                                        <ExternalLink size={12} /> Open
                                      </a>
                                      <button onClick={() => copyToClipboard(d.url, d.id)} className="text-[#444] hover:text-[#00d4ff] transition-colors">
                                        {copied === d.id ? <Check size={12} className="text-[#00ff88]" /> : <Copy size={12} />}
                                      </button>
                                      <Btn variant="ghost" size="xs" onClick={() => setEditDoc(d)}><Pencil size={10} /></Btn>
                                      <Btn variant="danger" size="xs" onClick={() => deleteItem(`/api/admin/documents/${d.id}`, "documents", d.name)}><Trash2 size={10} /></Btn>
                                    </div>
                                  </div>
                                ))}
                              </Card>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Todos ── */}
            {tab === "todos" && (
              <div className="space-y-5">
                {editTodo ? (
                  <Card className="p-6">
                    <TodoForm
                      initial={editTodo === "new" ? null : editTodo}
                      adminKey={adminKey}
                      onSave={() => { setEditTodo(null); refetch("todos"); }}
                      onCancel={() => setEditTodo(null)} />
                  </Card>
                ) : (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
                        <CheckSquare size={16} className="text-[#00ff88]" /> Tasks
                        <span className="text-[#333] text-xs font-normal">
                          ({stats.pending} pending{stats.overdue > 0 ? ` · ${stats.overdue} overdue` : ""})
                        </span>
                      </h2>
                      <div className="flex items-center gap-3">
                        {notifPerm !== "granted" && (
                          <Btn variant="ghost" size="xs" onClick={requestNotifications}>
                            <Bell size={10} /> Enable alerts
                          </Btn>
                        )}
                        <Btn variant="outline" onClick={() => setEditTodo("new")}><Plus size={12} /> Add Task</Btn>
                      </div>
                    </div>

                    {todos.length === 0 && (
                      <EmptyState icon={<CheckSquare size={40} />} text="No tasks yet. Add your first todo." />
                    )}

                    {todos.length > 0 && (
                      <div className="space-y-2">
                        {/* Pending */}
                        {todos.filter((t) => !t.completed).length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[#333] text-[10px] flex items-center gap-1.5"><Clock size={9} /> PENDING</p>
                            {todos.filter((t) => !t.completed).map((todo) => {
                              const p = PRIORITY_CONFIG[todo.priority as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG.medium;
                              const overdue = todo.due_date && new Date(todo.due_date) < new Date();
                              return (
                                <Card key={todo.id} className="px-4 py-3 flex items-start gap-3">
                                  <button onClick={() => toggleTodo(todo)}
                                    className="w-4 h-4 rounded border border-[#2a3444] mt-0.5 flex-shrink-0 flex items-center justify-center hover:border-[#00ff88] transition-colors" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="text-[#e2e8f0] text-xs font-medium">{todo.title}</p>
                                      <Badge color={p.color}>{p.label}</Badge>
                                      {overdue && <Badge color="#ff4757">Overdue</Badge>}
                                    </div>
                                    {todo.description && <p className="text-[#555] text-[10px] mt-0.5">{todo.description}</p>}
                                    {todo.due_date && (
                                      <p className={`text-[10px] mt-1 flex items-center gap-1 ${overdue ? "text-[rgba(255,71,87,0.7)]" : "text-[#333]"}`}>
                                        <Calendar size={9} /> Due {new Date(todo.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Btn variant="ghost" size="xs" onClick={() => setEditTodo(todo)}><Pencil size={10} /></Btn>
                                    <Btn variant="danger" size="xs" onClick={() => deleteItem(`/api/admin/todos/${todo.id}`, "todos", todo.title)}><Trash2 size={10} /></Btn>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        )}

                        {/* Completed */}
                        {todos.filter((t) => t.completed).length > 0 && (
                          <div className="space-y-2 mt-4">
                            <p className="text-[#2a3444] text-[10px] flex items-center gap-1.5"><Check size={9} /> COMPLETED</p>
                            {todos.filter((t) => t.completed).map((todo) => (
                              <div key={todo.id} className="flex items-center gap-3 px-4 py-2.5 bg-[#0d1117] border border-[#1e293b] rounded-xl opacity-50">
                                <button onClick={() => toggleTodo(todo)}
                                  className="w-4 h-4 rounded border border-[rgba(0,255,136,0.4)] bg-[rgba(0,255,136,0.1)] flex items-center justify-center flex-shrink-0">
                                  <Check size={8} className="text-[#00ff88]" />
                                </button>
                                <p className="flex-1 text-xs text-[#444] line-through">{todo.title}</p>
                                <Btn variant="danger" size="xs" onClick={() => deleteItem(`/api/admin/todos/${todo.id}`, "todos", todo.title)}><Trash2 size={10} /></Btn>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0e1a] border-t border-[#1e293b]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className="flex items-stretch">
            {NAV_ITEMS.map((item) => {
              const isActive = tab === item.id;
              const badge = navBadge[item.id];
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative transition-all"
                  style={{ minHeight: 56 }}>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#00ff88]" />
                  )}
                  <span style={{ color: isActive ? "#00ff88" : "#2a3444" }} className="transition-colors relative">
                    {item.icon}
                    {badge !== undefined && (
                      <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-[#00ff88] text-[#010409] text-[8px] font-bold flex items-center justify-center leading-none">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </span>
                  <span className="text-[8px] font-mono transition-colors" style={{ color: isActive ? "#00ff88" : "#333" }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
    </>
  );
}
