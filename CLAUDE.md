# Perfect Wedding

Wedding app for guests and toastmasters.

## Tech Stack
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 (in `web/`)
- **Database:** Supabase (PostgreSQL + Realtime)
- **AI:** Claude API via `@anthropic-ai/sdk`
- **Deploy:** Vercel (perfect-wedding.vercel.app)
- **Python:** Tooling and scripts (pyproject.toml)

## Structure
- `web/` — Next.js app (all frontend + API routes)
- `supabase/` — Database schema and migrations
- Root — Python tooling, Makefile, project config

## Commands
- `make dev` — Start local dev server
- `make build` — Build for production
- `make deploy` — Deploy to Vercel
- `make lint` — Run linter

## Key Patterns
- App Router (Next.js)
- Mobile-first responsive design
- Supabase Realtime for chat
- API routes for server-side logic (Claude API, etc.)
