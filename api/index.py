import os
import sys

# Make the backend package importable from the Vercel Python runtime
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../backend"))

from app.main import app  # noqa: F401, E402 — Vercel discovers the ASGI app via this name
