# Blog Writing Rules — Vaibhav Shelke

Use this file every time you write a new blog post. Follow these rules to keep posts consistent, readable, and attractive on the portfolio.

---

## 1. Post Structure (always follow this order)

```
Title        → clear, specific, searchable
Excerpt      → 1-2 sentences, the "why should I read this" hook
Tags         → 2-5 tags, specific technologies (React, Node.js, Redis)
Accent Color → pick one that matches the tech (green=js, cyan=api, red=error, purple=misc)
Content      → follow the template below
```

---

## 2. Content Template

Every post should follow this skeleton:

```markdown
## The Problem (1-3 sentences — what broke or what you needed)

Short punchy intro. State the problem immediately.
No long backstory. Readers came here for the solution.

---

## Why This Happens (optional — explain the root cause)

Brief explanation of WHY this is a problem.
Use a blockquote for the key insight:

> The core reason: React 18 remounts every component twice in development to expose cleanup bugs.

---

## The Fix

### Fix 1: [Specific scenario]

\`\`\`javascript
// ❌ Old way — what breaks
const source = axios.CancelToken.source();

// ✅ New way — what works
const controller = new AbortController();
\`\`\`

Explain in 1-2 sentences what changed and why this works.

---

### Fix 2: [Another scenario]

\`\`\`javascript
// code here
\`\`\`

---

## Results / Proof (use real numbers when possible)

| Metric       | Before  | After  |
|--------------|---------|--------|
| Response time| 340ms   | 18ms   |
| Error rate   | 12%     | 0%     |

---

## TL;DR

- Point 1 — the most important takeaway
- Point 2
- Point 3
```

---

## 3. Writing Rules

### Titles
- Be specific: **"Redis Caching in Node.js: How I Cut Response Time by 40%"** ✅
- Not vague: **"How to Use Redis"** ❌
- Include the tech + the outcome in the title
- Max 70 characters

### Excerpts (shown on blog list page)
- One sentence that answers: "What will I get from reading this?"
- Include a number or result if you have one
- Example: *"Upgraded to Axios 1.x and hitting mysterious CORS errors? Here's what changed and exactly how I fixed each issue in production."*

### Paragraphs
- Max 3 sentences per paragraph
- One idea per paragraph
- Start with the point, then explain — not the other way

### Code blocks
Always add a language tag for syntax highlighting:
````
```javascript   ← JS/Node.js
```typescript   ← TypeScript/Next.js
```bash         ← terminal commands
```sql          ← database queries
```json         ← config files
```css          ← styles
````

Always show ❌ old way and ✅ new way side by side when fixing something.

### Headings
- `##` for main sections (appears in TOC)
- `###` for sub-sections within a fix
- Never use `#` (that's the page title, handled automatically)
- Keep headings short — they're labels, not sentences

### Use `---` horizontal rules generously
Separates sections visually. Put one after every `##` section.

---

## 4. Accent Color Guide

Pick the color that matches the main technology:

| Color      | Hex       | Use for                          |
|------------|-----------|----------------------------------|
| Green      | `#00ff88` | JavaScript, Node.js, general tips|
| Cyan       | `#00d4ff` | APIs, HTTP, Axios, fetch         |
| Purple     | `#9d4edd` | React, Next.js, frontend         |
| Yellow     | `#ffd32a` | Performance, optimization, speed |
| Red        | `#ff4757` | Bugs, errors, debugging, security|
| Orange     | `#f89f1b` | Database, backend, Redis         |

---

## 5. Tags — Use These Consistently

**Frontend:** `React` `Next.js` `TypeScript` `JavaScript` `CSS` `Tailwind`

**Backend:** `Node.js` `Express` `API` `REST` `GraphQL`

**Database:** `MongoDB` `PostgreSQL` `Redis` `Neon` `Prisma`

**DevOps:** `Vercel` `Docker` `CI/CD` `GitHub Actions`

**Topics:** `Performance` `Debugging` `Security` `Tips` `Architecture`

Always use Title Case for tags. Max 5 tags per post.

---

## 6. Good Post Ideas (by category)

### Debugging Posts (easiest to write — you solved a real problem)
- "Why [library] broke after upgrading to [version]"
- "The [X] error that took me 3 hours to debug"
- "How I fixed [specific error message]"
- "[Tool] not working with [framework]? Here's why"

### How-I-Did-It Posts (your own projects)
- "How I built [feature] in my portfolio"
- "Adding [feature] to a Next.js app in [X] minutes"
- "How I reduced [metric] by [X]% using [technology]"

### Concept Explanation Posts
- "[Concept] explained with code examples"
- "The difference between [A] and [B] — with real examples"
- "[Feature] in [version]: what changed and how to migrate"

### Quick Tip Posts (short, high value)
- "5 [technology] tricks I use in every project"
- "Stop doing [bad practice] — do this instead"
- "The [X]-line [language] snippet that saved me hours"

---

## 7. Image Rules

Add images using Markdown:

```markdown
![Description of image](/blog/image-name.png)
```

**For local images:** Put the file in `public/blog/` folder, use path `/blog/filename.png`

**For external images:**
- Imgur: upload at imgur.com, use the direct `.jpg`/`.png` URL
- Google Drive: change `/view?usp=sharing` → `/uc?export=view&id=FILE_ID`
- Cloudinary: use the delivery URL directly

**Image tips:**
- Add a diagram for architecture posts
- Add a screenshot for UI/error posts
- Add a terminal output screenshot for CLI posts
- Max 1-2 images per post — don't pad

---

## 8. Post Length Guide

| Post Type           | Target Length       |
|---------------------|---------------------|
| Quick tip           | 300 – 500 words     |
| Debug fix           | 500 – 900 words     |
| How-I-built         | 800 – 1500 words    |
| Deep dive/concept   | 1000 – 2000 words   |

**Never write filler.** If you've made your point, end the post. Readers respect that.

---

## 9. Before Publishing Checklist

- [ ] Title is specific and includes the tech + result
- [ ] Excerpt hooks the reader in one sentence
- [ ] Code blocks have language tags (```javascript not ```)
- [ ] ❌/✅ pattern used for before/after code
- [ ] Every section separated by `---`
- [ ] TL;DR at the bottom
- [ ] 2-5 tags added
- [ ] Correct accent color chosen
- [ ] Published toggle is ON

---

## 10. Full Example Post

**Title:** `useEffect Cleanup: The Pattern That Fixes 90% of React Memory Leaks`
**Excerpt:** `Missing cleanup in useEffect causes memory leaks and stale state. Here's the one pattern I use in every component that fixes it.`
**Tags:** `React` `useEffect` `Performance` `Debugging`
**Color:** `#9d4edd` (purple — React)

```markdown
## The Problem

You navigate away from a page and see this in the console:

> Warning: Can't perform a React state update on an unmounted component.

This is a memory leak. Your effect is still running after the component is gone.

---

## Why It Happens

When a component unmounts, React doesn't automatically cancel async operations
that were started inside `useEffect`. Fetches keep running, intervals keep firing,
subscriptions keep listening — all after the component is dead.

> Every effect that starts something must return a function that stops it.

---

## The Fix

### Fetch calls

\`\`\`javascript
// ❌ Leaks — fetch continues after unmount
useEffect(() => {
  fetch('/api/user').then(setUser);
}, []);

// ✅ Cancelled on unmount
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/user', { signal: controller.signal })
    .then(setUser)
    .catch((e) => { if (e.name !== 'AbortError') console.error(e); });
  return () => controller.abort();
}, []);
\`\`\`

---

### Intervals and timers

\`\`\`javascript
// ❌ Interval runs forever
useEffect(() => {
  setInterval(() => setCount((c) => c + 1), 1000);
}, []);

// ✅ Cleared on unmount
useEffect(() => {
  const id = setInterval(() => setCount((c) => c + 1), 1000);
  return () => clearInterval(id);
}, []);
\`\`\`

---

### Event listeners

\`\`\`javascript
// ✅ Always remove what you add
useEffect(() => {
  const handler = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
\`\`\`

---

## TL;DR

- Always return a cleanup function from `useEffect`
- Use `AbortController` for fetch requests
- Use `clearInterval` / `clearTimeout` for timers
- Use `removeEventListener` for DOM events
- If React 18 Strict Mode breaks your effect — you have a cleanup bug
```
