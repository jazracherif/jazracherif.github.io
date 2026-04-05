# jazracherif.github.io

Personal blog and website for Cherif Jazra, built with [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/).

**Live site:** [https://jazracherif.github.io](https://jazracherif.github.io)

Topics covered: accelerated computing, NVIDIA/GPU technology, worldly matters, and personal essays.

---

## Project Structure

```
.
├── _config.yml              # Site-wide Jekyll configuration
├── _posts/                  # Published blog posts (live on the site)
├── _drafts/                 # WIP drafts (shown locally with --drafts flag, not published)
├── _posts_archive/          # Archived posts (not built by Jekyll)
├── _layouts/                # HTML page layout templates
├── _includes/               # Reusable HTML partials (header, footer, etc.)
├── assets/                  # CSS and images
│   ├── css/
│   └── img/
├── _site/                   # Jekyll build output (auto-generated, not committed)
├── index.markdown           # Home page
├── writings.markdown        # Writings index page
├── worldly-matters.markdown # Worldly matters index page
├── about.markdown           # About page
├── Gemfile                  # Ruby gem dependencies
└── _config.yml              # Jekyll site configuration
```

Post filenames follow the format: `YYYY-MM-DD-slug-title.markdown`

---

## Local Development

**Prerequisites:** Ruby and Bundler installed.

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Serve the site locally with live reload:
   ```bash
   bundle exec jekyll serve --livereload
   ```

3. Open [http://localhost:4000](http://localhost:4000) in your browser.

> **Note:** Changes to `_config.yml` require restarting the server. All other files hot-reload automatically.

### Previewing Draft Posts

Draft posts live in `_drafts/` and use Jekyll's built-in drafts feature. To preview them locally, add the `--drafts` flag:

```bash
bundle exec jekyll serve --livereload --drafts
```

Drafts will appear in the local build with today's date but are never included in the production build pushed to GitHub Pages.

---

## Deployment

The site is hosted on GitHub Pages and deploys automatically on every push to the `master` branch. No manual build step is required.

```bash
git add .
git commit -m "your message"
git push origin master
```

GitHub Pages will build and publish the site within a minute or two.

---

## Writing a New Post

Use the Copilot `create-new-post` skill to scaffold a draft, then `deploy-post` when ready to publish. See the **Copilot Skills** section below for details.

Post lifecycle:
```
_drafts/WIP_YYYY-MM-DD-title.markdown         ← draft (visible locally with --drafts)
        ↓  (deploy-post skill)
_posts/YYYY-MM-DD-title.markdown              ← live
```

---

## Copilot Skills

Two VS Code Copilot skills are available under `.github/skills/` to streamline blog post management:

### `create-new-post`
Creates a new draft blog post from the standard template.
- Places the file in `_drafts/` with a `WIP_` prefix
- Filename format: `WIP_YYYY-MM-DD-slugified-title.markdown`
- Trigger: *"create a new post about X"*, *"add a new draft post"*

### `deploy-post`
Publishes a draft post by removing the `WIP_` prefix and moving it to `_posts/`.
- Trigger: *"deploy this post"*, *"publish my draft about X"*

---

# TODO List

## Content Updates
  
- [ ] Plan for another GTC conference blog series in 2026
  - The 2025 GTC pic is powerful, repeat for next year

## Technical Improvements
  
  
- [ ] Add navigation arrows for blog posts
  - Currently have multiple blog posts
  - Add prev/next arrows to navigate between posts
  - Makes it easier to browse through the blog series

- [ ] Make `milestone-timeline` CSS work from a plain `<ol>` in Markdown
  - Currently authoring requires verbose `<div class="milestone-timeline">` blocks with one `<div class="mt-year">`, `<div class="mt-connector">…</div>`, `<div class="mt-content">` triplet per row (see Part 3 keynote post for an example)
  - Goal: style a plain `<ol class="milestone-timeline"><li><strong>2016</strong> DGX-1 — …</li>…</ol>` — no nested divs
  - CSS approach: use `::marker` or `counter()` for the year, a left border + `::before` pseudo-element for the dot+line, and `data-year` attribute on each `<li>` for the label
  - Blocked by Jekyll's Markdown renderer (Kramdown) stripping custom attributes on `<li>` — may need a Liquid include or a small JS snippet to inject `data-year` from the bold text node instead

## Future Content

- [ ] Add link to DGX spark Medium articles
  - Coming soon
  - Add when article is published
  