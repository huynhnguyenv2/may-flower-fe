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

## Planning

See `UI_UX_GUIDELINES.md`, `PRODUCT_VISION.md`, `ACCEPTANCE_CRITERIA.md`.
