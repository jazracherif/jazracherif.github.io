---
name: serve-local
description: "Use when: rebuilding the website, running Jekyll locally, serving the site, starting the local server, previewing the site, hot-reloading, live reload. Kills any existing Jekyll server, rebuilds the site, and starts a new local server with live reload."
---

# Serve Jekyll Locally

## Workflow

1. **Kill any running Jekyll server** to avoid port conflicts:
   ```bash
   pkill -f "jekyll serve" 2>/dev/null || true
   ```

2. **Start the server in the background** with live reload and drafts always enabled:
   ```bash
   bundle exec jekyll serve --livereload --drafts
   ```
   Use `isBackground: true` so the terminal is not blocked.

3. **Wait briefly and verify** the server is up:
   ```bash
   sleep 4 && curl -s -o /dev/null -w "%{http_code}" http://localhost:4000
   ```
   A `200` response confirms the site is live.

4. **Confirm** to the user that the site is available at <http://localhost:4000>.

## Rules

- Always run from the workspace root (`/Users/cherifjazra/code/jazracherif.github.io`).
- Always include `--drafts` so posts in `_drafts/` are visible locally.
- Use `bundle exec jekyll` — never bare `jekyll` — to respect the project's Gemfile.
- If the build step fails (non-zero exit), surface the error output to the user before stopping.
- Do not open the browser automatically unless the user asks.
