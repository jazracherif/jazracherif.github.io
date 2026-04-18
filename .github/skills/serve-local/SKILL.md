---
name: serve-local
description: "Use when: rebuilding the website, running Jekyll locally, serving the site, starting the local server, previewing the site, hot-reloading, live reload. Kills any existing Jekyll server, rebuilds the site, and starts a new local server with live reload."
---

# Serve Jekyll Locally

## Workflow

1. **Run the serve script** (kills any existing server, starts a new one with live reload and drafts, and verifies it is up):
   ```bash
   bash .github/skills/serve-local/serve-local.sh
   ```
   Use `mode=async` so the terminal is not blocked.

2. **Confirm** to the user that the site is available at <http://localhost:4000>.

## Rules

- Always run from the workspace root (`/Users/cherifjazra/code/jazracherif.github.io`).
- Always include `--drafts` so posts in `_drafts/` are visible locally.
- Use `bundle exec jekyll` — never bare `jekyll` — to respect the project's Gemfile.
- If the build step fails (non-zero exit), surface the error output to the user before stopping.
- Do not open the browser automatically unless the user asks.
