#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"

cd "$REPO_ROOT"

# Kill any running Jekyll server to avoid port conflicts
pkill -f "jekyll serve" 2>/dev/null || true

# Start server with live reload and drafts enabled (background)
bundle exec jekyll serve --livereload --drafts &

# Wait for server to come up, then verify
sleep 4
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000)

if [ "$STATUS" = "200" ]; then
  echo "Site is live at http://localhost:4000 (status $STATUS)"
else
  echo "Warning: server returned HTTP $STATUS" >&2
fi
