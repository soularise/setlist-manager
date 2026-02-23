from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import profile, setlists, songs

settings = get_settings()

app = FastAPI(title="Setlist Manager API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allowed_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile.router)
app.include_router(songs.router)
app.include_router(setlists.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
