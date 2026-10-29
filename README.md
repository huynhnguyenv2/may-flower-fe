# May Flower — Storefront

Next.js public site (`frontend/`). Calls the API at `NEXT_PUBLIC_API_URL` (default `/v1` on the backend).

API: sibling [`../may-flower-be/`](../may-flower-be/) · GitHub [may-flower-be](https://github.com/huynhnguyenv2/may-flower-be). Planning docs: [`../`](../) (workspace root).

## Prerequisites

- Node.js 20+
- pnpm 9+
- Running May Flower API (local or deployed)

## Setup

```bash
pnpm install
pnpm --filter @may-flower/shared build
cp frontend/.env.example frontend/.env.local 2>/dev/null || true
```

Set `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:3101/v1`).

## Development

```bash
pnpm dev
```

- Web: http://localhost:3100

## Tests

```bash
pnpm test
```

## Deploy to Vercel

1. Import the **`may-flower-fe`** repo (this folder as the Git root, not the parent `may-flower` docs-only tree).
2. **Root Directory:** `frontend` (required). `frontend/vercel.json` runs `pnpm install` + `pnpm build` from the **repo root** so the workspace package `@may-flower/shared` is linked.
3. Do **not** override Install/Build in the Vercel UI unless you know why — use `frontend/vercel.json`.
4. **Environment variable (Production + Preview):**
   - `NEXT_PUBLIC_API_URL` = `https://<your-backend-host>/v1` (e.g. Render/Railway/Fly URL for `may-flower-be`).
5. **Node:** 20.x (match `engines` in `package.json`).
6. After deploy, open the site and confirm home/collections load (no `API 500` in logs). Checkout needs a live API + MongoDB.

Local production check:

```bash
pnpm install
pnpm build
NEXT_PUBLIC_API_URL=http://localhost:3101/v1 pnpm --filter @may-flower/web start
```

## Planning

See `UI_UX_GUIDELINES.md`, `PRODUCT_VISION.md`, `ACCEPTANCE_CRITERIA.md`.
