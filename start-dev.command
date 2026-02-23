#!/bin/bash
# Double-click this file in Finder to start the dev servers.
# On first run: right-click → Open (to bypass Gatekeeper), then allow in System Settings.

PROJ_DIR="$(cd "$(dirname "$0")" && pwd)"

osascript <<EOF
tell application "Terminal"
    activate
    do script "echo '--- Backend ---' && cd '$PROJ_DIR/backend' && source .venv/bin/activate && uvicorn app.main:app --reload"
    do script "echo '--- Frontend ---' && cd '$PROJ_DIR/frontend' && npm run dev"
end tell
EOF

# Open browser once frontend is ready
sleep 4 && open http://localhost:5173 &
