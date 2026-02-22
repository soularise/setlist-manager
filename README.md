# Setlist Manager

Setlist Manager is a web application for musicians to organize their song library and create setlists for performances.

## Tech Stack

- **Backend**: Python (FastAPI)
- **Frontend**: React (TypeScript + Vite)
- **Database**: Supabase (Postgres + Auth + Storage)
- **Styling**: Tailwind CSS v4

## Project Structure

```
setlist-manager/
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── main.py         # App entry point
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── models/         # Pydantic models
│   │   └── db/             # Database configuration
│   ├── tests/              # Unit tests
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utility functions
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── supabase/               # Supabase database configuration
│   ├── migrations/         # SQL migration files
│   └── seed.sql            # Seed data
│
└── README.md               # Project documentation
```

## Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Database Schema

### Tables

- **songs**: `id`, `title`, `artist`, `bpm`, `duration_seconds`, `user_id`
- **setlists**: `id`, `name`, `description`, `user_id`
- **setlist_songs**: `id`, `setlist_id`, `song_id`, `position`, `notes`

All tables have Row Level Security (RLS) enabled to restrict access to the owning user.

## Best Practices

### Python (FastAPI)

- Use Pydantic models for request/response validation
- Keep route handlers thin and delegate logic to services
- Use dependency injection for shared resources
- Type hint all functions and run `mypy` in CI
- Use `black` for formatting and `ruff` for linting

### React (Frontend)

- Keep UI components presentational and reusable
- Data fetching and mutation logic in custom hooks
- Use TypeScript for type safety
- Implement optimistic UI updates where appropriate
- Ensure mobile-first responsive design

## License

MIT
