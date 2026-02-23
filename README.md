# Setlist Manager

A web application for musicians to organize their song library and create setlists for performances. Features a dark dashboard UI with drag-and-drop setlist editing, PDF printing, and real-time collaboration-ready architecture.

## Tech Stack

- **Backend**: Python (FastAPI)
- **Frontend**: React (TypeScript + Vite)
- **Database**: Supabase (Postgres + Auth + Row Level Security)
- **Styling**: Tailwind CSS v4 + CSS custom properties
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable

## Features

- **Song Library** — Add, edit, and delete songs with title, artist, BPM, and duration
- **Setlists** — Create, duplicate, rename, and delete setlists
- **Drag-and-drop editing** — Drag songs from the library into a setlist; reorder rows within a setlist
- **Break/divider rows** — Insert named break markers between songs; drag to reorder
- **PDF printing** — Clean print layout with auto-numbered songs
- **User profiles** — Display name and avatar
- **Dashboard home** — Overview with stats (setlist count, song count) and recent setlists
- **Dark theme** — Deep navy design based on a professional dark dashboard style guide

## Project Structure

```
setlist-manager/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point + CORS
│   │   ├── config.py            # Settings via pydantic-settings
│   │   ├── dependencies.py      # Auth dependency (JWT → Supabase user)
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── songs.py
│   │   │   └── setlists.py      # Setlist + setlist_songs endpoints
│   │   ├── models/
│   │   │   ├── song.py
│   │   │   └── setlist_song.py  # Includes BreakCreate, BreakLabelUpdate
│   │   ├── services/
│   │   │   ├── song_service.py
│   │   │   └── setlist_service.py  # Two-phase reorder to avoid constraint conflicts
│   │   └── db/
│   │       └── supabase.py
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Dashboard overview (stats + recent setlists)
│   │   │   ├── Dashboard.tsx     # Full setlist grid (/setlists)
│   │   │   ├── SetlistDetail.tsx # Setlist editor with two-column DnD layout
│   │   │   ├── Songs.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Login.tsx
│   │   ├── components/
│   │   │   ├── ui/               # Button, Input, Modal, Badge, Nav
│   │   │   ├── setlists/         # SetlistEditor, SetlistCard, DraggableRow,
│   │   │   │                     # BreakRow, SongLibraryPanel, DraggableSongItem
│   │   │   ├── songs/            # SongCard, SongForm, SongList
│   │   │   └── profile/          # Avatar, ProfileForm
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSetlists.ts
│   │   │   ├── useSetlist.ts     # Single setlist + songs with addBreak, reorder
│   │   │   ├── useSongs.ts
│   │   │   └── useProfile.ts
│   │   ├── lib/
│   │   │   ├── api.ts            # Typed fetch wrappers for all backend endpoints
│   │   │   ├── supabaseClient.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── index.ts          # Song, Setlist, SetlistSongWithSong (song_id nullable for breaks)
│   │   └── styles/
│   │       └── globals.css       # Color palette, gradient utilities, print styles
│   └── package.json
│
├── supabase/
│   ├── migrations/               # Versioned SQL migrations
│   └── seed.sql
│
├── start-dev.command             # Double-click to launch backend + frontend (macOS)
└── README.md
```

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Dashboard overview — stats, quick actions, recent setlists |
| `/setlists` | `Dashboard` | Full setlist grid with create/delete/duplicate |
| `/setlists/:id` | `SetlistDetail` | Setlist editor with song library panel |
| `/songs` | `Songs` | Song library management |
| `/profile` | `Profile` | User profile and avatar |
| `/login` | `Login` | Sign in / create account (public) |

All app routes are protected via `ProtectedLayout` — unauthenticated users are redirected to `/login`.

## Database Schema

| Table | Key columns |
|---|---|
| `songs` | `id`, `title`, `artist`, `bpm`, `duration_seconds`, `user_id` |
| `setlists` | `id`, `name`, `description`, `user_id` |
| `setlist_songs` | `id`, `setlist_id`, `song_id` (nullable — null for breaks), `position`, `notes`, `break_label` |

All tables have RLS enabled. Policies restrict reads/writes to the owning `user_id`.

## Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# API available at http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

### Quick Launch (macOS)

Double-click `start-dev.command` in Finder to open terminal windows for both servers and launch the browser automatically.

### Network Access (LAN)

The frontend is configured with `host: true` in `vite.config.ts` and the backend CORS allows both `localhost:5173` and the LAN IP. Update `ALLOWED_ORIGINS` in `backend/.env` as needed.

## Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `SUPABASE_URL` | `backend/.env` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | `backend/.env` | Service role key (server-side) |
| `ALLOWED_ORIGINS` | `backend/.env` | Comma-separated CORS origins |
| `VITE_SUPABASE_URL` | `frontend/.env` | Supabase URL (public) |
| `VITE_SUPABASE_ANON_KEY` | `frontend/.env` | Anon key (public) |

Never commit `.env` files.

## Design System

Colors and utilities are defined as CSS custom properties in `globals.css`:

- **Dark theme** — deep navy (`#06152b` background, `#0c1f3a` surfaces)
- **Accent** — purple `#3e36db` / `#6e6ae8` (dark mode)
- **Secondary** — blue `#0090ff`
- **`.gradient-bg`** — purple→blue gradient (buttons, nav accent line)
- **`.gradient-text`** — gradient clip text (nav logo, titles, links)
- Print mode overrides gradient text to black and hides navigation

## License

MIT
