import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

const SEED_BLOGS = [
  {
    title: "Axios 1.x Gotchas: CORS, Interceptors & Silent Failures in 2025",
    slug: "axios-1x-gotchas-cors-interceptors-2025",
    excerpt: "Upgraded to Axios 1.x and hitting mysterious CORS errors or broken interceptors? Here's what changed and how I fixed each issue in production.",
    cover_color: "#00d4ff",
    tags: ["Axios", "JavaScript", "API", "Debugging"],
    published: true,
    content: `## The Breaking Changes Nobody Warned You About

Axios 1.0 shipped with several silent breaking changes that only surface at runtime. If you upgraded and things broke — you're not alone.

---

## 1. CancelToken is Deprecated

The old \`CancelToken\` API still works but logs warnings. Migrate to \`AbortController\`:

\`\`\`js
// ❌ Old way (deprecated)
const source = axios.CancelToken.source();
axios.get('/api/data', { cancelToken: source.token });
source.cancel('Cancelled');

// ✅ New way
const controller = new AbortController();
axios.get('/api/data', { signal: controller.signal });
controller.abort();
\`\`\`

---

## 2. CORS Errors After Upgrading

If you're suddenly hitting CORS issues after upgrading, check your interceptors. Axios 1.x changed how request headers are merged:

\`\`\`js
// ❌ This no longer deep-merges correctly in 1.x
axios.defaults.headers.common['Authorization'] = token;

// ✅ Do this instead
const api = axios.create({
  headers: { Authorization: \`Bearer \${token}\` }
});
\`\`\`

---

## 3. Response Interceptors Not Catching Network Errors

A very common gotcha — network errors (no response) bypass response interceptors:

\`\`\`js
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // error.response is undefined for network errors!
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      // handle token refresh
    }
    return Promise.reject(error);
  }
);
\`\`\`

---

## My Recommended Axios Setup in 2025

Here's the base config I use in every Next.js + Node.js project:

\`\`\`js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// Response: handle 401 refresh
api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      await refreshAccessToken();
      return api(original);
    }
    return Promise.reject(error);
  }
);

export default api;
\`\`\`

---

## Should You Switch to Fetch?

With Next.js 14 extending the native \`fetch\` API with caching and revalidation, fetch is now a serious option. But Axios still wins on:

- Automatic JSON transformation
- Request/response interceptors
- Upload progress tracking
- Better error objects

Stick with Axios — just know its quirks.`
  },
  {
    title: "React 18 Strict Mode Double-Invoke: The Bug That Broke My App",
    slug: "react-18-strict-mode-double-invoke-fix",
    excerpt: "React 18 Strict Mode intentionally mounts and unmounts every component twice in development. Here's why it breaks useEffect and exactly how to fix it.",
    cover_color: "#00ff88",
    tags: ["React", "useEffect", "Debugging", "Next.js"],
    published: true,
    content: `## What Changed in React 18

React 18 Strict Mode now intentionally **mounts, unmounts, and remounts** every component in development. Every \`useEffect\` runs **twice**.

This is by design — React wants you to write cleanup-safe effects. But it breaks a lot of existing code.

---

## The Symptoms

\`\`\`js
useEffect(() => {
  fetchUserData();          // Called twice in dev!
  const socket = new WebSocket(url); // Connects → disconnects → connects

  return () => socket.close(); // Runs before component actually unmounts
}, []);
\`\`\`

---

## Fix 1: API Called Twice on Mount

\`\`\`js
// ❌ Breaks in Strict Mode
useEffect(() => {
  fetch('/api/user').then(setUser);
}, []);

// ✅ Fixed with AbortController
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/user', { signal: controller.signal })
    .then(setUser)
    .catch((err) => {
      if (err.name !== 'AbortError') throw err;
    });
  return () => controller.abort();
}, []);
\`\`\`

---

## Fix 2: Third-Party Library Initializes Twice

Some libraries (maps, charts, video players) crash when \`init()\` is called twice:

\`\`\`js
// ✅ Use a ref flag
const initialized = useRef(false);

useEffect(() => {
  if (initialized.current) return;
  initialized.current = true;

  myLibrary.init(containerRef.current);

  return () => {
    initialized.current = false;
    myLibrary.destroy();
  };
}, []);
\`\`\`

---

## Fix 3: WebSocket Double-Connect

\`\`\`js
// ✅ Always clean up your socket
useEffect(() => {
  const socket = new WebSocket(url);
  socket.onmessage = (e) => setMessages((m) => [...m, e.data]);
  return () => socket.close();
}, [url]);
\`\`\`

---

## The Golden Rule

> Every effect that sets something up should return a cleanup function that tears it down.

If your effect can safely run twice (idempotent), you're fine. If not — always return a cleanup.

---

## Should You Disable Strict Mode?

**No.** Strict Mode only double-invokes in development. Production runs effects once.

If disabling strict mode "fixes" your problem, you have a cleanup bug that will eventually cause memory leaks or stale state in production.

---

## useEffect vs useLayoutEffect

If you see flickering or layout jumps, switch to \`useLayoutEffect\`. It runs synchronously before the browser paints:

\`\`\`js
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setHeight(rect.height);
}, []);
\`\`\`

Fix your cleanup functions. Your future self will thank you.`
  },
  {
    title: "Redis Caching in Node.js: How I Cut API Response Time by 40%",
    slug: "redis-caching-nodejs-40-percent-faster",
    excerpt: "Our Express API was serving 50K+ requests/day with 340ms MongoDB queries. After adding Redis caching, the same queries returned in under 20ms. Here's exactly how.",
    cover_color: "#ff4757",
    tags: ["Redis", "Node.js", "Performance", "Backend", "Express"],
    published: true,
    content: `## Why Redis?

Redis is an in-memory data store. Unlike MongoDB (disk-based), Redis keeps everything in RAM — making it 100–1000x faster for reads.

Use it for data that is:
- Frequently read, rarely written
- Expensive to compute (aggregations, joins)
- OK to be slightly stale (seconds to minutes)

---

## Setup

\`\`\`bash
npm install ioredis
\`\`\`

\`\`\`js
// lib/redis.js
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

export default redis;
\`\`\`

---

## The Cache-Aside Pattern

Check cache first, fall back to DB on miss:

\`\`\`js
async function getCachedUser(userId) {
  const key = \`user:\${userId}\`;

  // 1. Check Redis
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss — hit MongoDB
  const user = await User.findById(userId).lean();

  // 3. Store with 15-minute TTL
  await redis.setex(key, 900, JSON.stringify(user));

  return user;
}
\`\`\`

---

## Route-Level Caching Middleware

Cache entire responses for public endpoints:

\`\`\`js
function cacheMiddleware(ttl = 300) {
  return async (req, res, next) => {
    const key = \`route:\${req.originalUrl}\`;

    const cached = await redis.get(key);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redis.setex(key, ttl, JSON.stringify(data));
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}

// Usage — cache product list for 10 minutes
router.get('/products', cacheMiddleware(600), getProducts);
\`\`\`

---

## Cache Invalidation

Always invalidate on write — stale cache = wrong data:

\`\`\`js
async function updateUser(userId, data) {
  await User.findByIdAndUpdate(userId, data);

  // Blow away the cache immediately
  await redis.del(\`user:\${userId}\`);

  // Clear list caches too
  const keys = await redis.keys('users:list:*');
  if (keys.length) await redis.del(...keys);
}
\`\`\`

---

## Results at Konax Technology

| Metric | Before Redis | After Redis |
|---|---|---|
| Avg query time | 340ms | 18ms |
| P99 response | 1.2s | 280ms |
| DB query load | baseline | −78% |

Cache hit rate reached **80%** within a week. Overall response time dropped **40%**.

---

## Common Mistakes

1. **Shared key for user-specific data** — always include \`userId\` in the key
2. **No TTL set** — orphaned keys fill your RAM
3. **Caching errors** — only cache successful responses
4. **Huge objects** — Redis is RAM. Cache IDs, not entire nested documents

Redis isn't a silver bullet — but for read-heavy APIs, it's the fastest performance win available.`
  }
];

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const results = [];
  for (const blog of SEED_BLOGS) {
    try {
      const rows = await sql.query(
        `INSERT INTO blogs (title, slug, excerpt, content, tags, cover_color, published)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (slug) DO NOTHING RETURNING id, title`,
        [blog.title, blog.slug, blog.excerpt, blog.content, blog.tags, blog.cover_color, blog.published]
      );
      results.push({ slug: blog.slug, inserted: rows.length > 0 });
    } catch (e) {
      results.push({ slug: blog.slug, error: String(e) });
    }
  }

  return NextResponse.json({ results });
}
