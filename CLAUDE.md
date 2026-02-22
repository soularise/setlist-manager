# Setlist Manager — CLAUDE.md

Guidance for Claude Code when working in this repository.

---

## Stack

- **Backend**: Python (FastAPI)
- **Frontend**: React (TypeScript + Vite)
- **Database**: Supabase (Postgres + Auth + Storage)
- **Styling**: Tailwind CSS v4

---

## Project Structure

```
setlist-manager/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Settings via pydantic-settings
│   │   ├── dependencies.py      # Shared FastAPI dependencies (e.g. current_user)
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── songs.py
│   │   │   └── setlists.py
│   │   ├── models/
│   │   │   ├── song.py          # Pydantic request/response models
│   │   │   └── setlist.py
│   │   ├── services/
│   │   │   ├── song_service.py  # Business logic; calls Supabase client
│   │   │   └── setlist_service.py
│   │   └── db/
│   │       └── supabase.py      # Supabase client singleton
│   ├── tests/
│   │   └── test_songs.py
│   ├── requirements.txt
│   └── .env                     # SUPABASE_URL, SUPABASE_KEY, etc. (never commit)
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── lib/
│   │   │   ├── supabaseClient.ts  # Browser Supabase client
│   │   │   ├── api.ts             # Typed fetch wrappers for backend endpoints
│   │   │   └── utils.ts           # formatDuration, etc.
│   │   ├── types/
│   │   │   └── index.ts           # Song, Setlist, SetlistSong interfaces
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSongs.ts
│   │   │   └── useSetlist.ts
│   │   ├── components/
│   │   │   ├── ui/                # Generic: Button, Input, Modal, Badge
│   │   │   ├── songs/             # SongCard, SongForm, SongList
│   │   │   └── setlists/          # SetlistEditor, SetlistCard, DraggableRow
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Songs.tsx
│   │   │   └── SetlistDetail.tsx
│   │   └── styles/
│   │       └── globals.css        # Tailwind base + CSS custom properties
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── supabase/
│   ├── migrations/                # SQL migration files (versioned)
│   └── seed.sql                   # Optional dev seed data
│
└── README.md
```

---

## Dev Commands

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload      # http://localhost:8000
pytest                             # Run tests
```

### Frontend
```bash
cd frontend
npm install
npm run dev                        # http://localhost:5173
npm run build
npm run lint
```

---

## Database Schema

| Table | Key columns |
|---|---|
| `songs` | `id`, `title`, `artist`, `bpm`, `duration_seconds`, `user_id` |
| `setlists` | `id`, `name`, `description`, `user_id` |
| `setlist_songs` | `id`, `setlist_id`, `song_id`, `position`, `notes` |

All tables have RLS enabled. Policies restrict reads/writes to the owning `user_id`.

---

## Python Best Practices

- **FastAPI routers** — one file per resource; keep route handlers thin (delegate to services).
- **Pydantic models** — separate `CreateRequest`, `UpdateRequest`, and `Response` schemas per resource. Never expose internal DB fields (e.g. raw `user_id`) in responses unless required.
- **Settings** — use `pydantic-settings` with a `Settings` class loaded once at startup via `@lru_cache`. Never hardcode secrets.
- **Supabase client** — instantiate once as a module-level singleton in `db/supabase.py`; inject via `Depends()` where needed.
- **Error handling** — raise `HTTPException` with explicit status codes. Let FastAPI's default exception handler format error responses consistently.
- **Type hints** — annotate all function signatures. Run `mypy` (or `pyright`) in CI.
- **Async** — use `async def` for all route handlers. Use `asyncio`-compatible Supabase calls where available.
- **Tests** — use `pytest` + `httpx.AsyncClient` with `TestClient` or `pytest-anyio`. Mock Supabase calls; do not hit the live DB in unit tests.
- **Formatting** — `black` for formatting, `ruff` for linting. Both enforced in CI.

---

## React / Frontend Best Practices

- **Component boundaries** — `ui/` holds purely presentational, reusable components with no data fetching. `pages/` own data and pass props down.
- **Custom hooks** — all data fetching and mutation logic lives in `hooks/`. Components stay declarative.
- **Types** — all shared types in `types/index.ts`. Import from there; never define inline types in components.
- **Auth** — Supabase Auth handles sessions client-side via `supabase.auth`. Gate protected routes in the router, not in individual components.
- **API calls** — typed wrappers in `lib/api.ts` call the FastAPI backend. Components never call `fetch` directly.
- **Drag-and-drop** — `@dnd-kit/core` + `@dnd-kit/sortable` for setlist reordering; batch-update positions to the backend after drop.
- **Tailwind** — use CSS custom properties for theming in `globals.css`; dark mode via `prefers-color-scheme`.

---

## Design Principles

- **Mobile-first** — all layouts are responsive; test at 375 px minimum.
- **Accessible** — semantic HTML, ARIA labels on icon-only buttons, keyboard-navigable modals.
- **Optimistic UI** — update local state immediately on mutation; roll back on error.
- **Consistent spacing** — use Tailwind spacing scale (multiples of 4 px). Avoid arbitrary values.
- **Color tokens** — define a palette in `globals.css` as CSS variables; never hardcode hex values in components.

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `SUPABASE_URL` | backend `.env` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | backend `.env` | Service role key (server-side only) |
| `VITE_SUPABASE_URL` | frontend `.env` | Supabase project URL (public) |
| `VITE_SUPABASE_ANON_KEY` | frontend `.env` | Anon key (public) |

Never commit `.env` files. Add them to `.gitignore`.
