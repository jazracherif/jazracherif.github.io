---
name: create-new-post
description: "Use when: creating a new blog post, adding a new draft post, writing a new article. Creates a new post file in _drafts/ using the standard template with the correct frontmatter, filename format, and WIP prefix."
---

# Create New Blog Post

## Workflow

1. **Ask for the post title** if not already provided.

2. **Determine the file name** using the format:
   ```
   WIP_YYYY-MM-DD-slugified-title.markdown
   ```
   - Use today's date for `YYYY-MM-DD`
   - Slugify the title: lowercase, replace spaces with hyphens, remove special characters (except `#` can be dropped)

3. **Create the file** at `_drafts/<filename>` using the template below.

4. **Confirm** the file path to the user.

## Template

```markdown
---
layout: post
title: "<TITLE>"
date: YYYY-MM-DD 00:00:00 -0700
categories: []
tags: []
---

<OPENING_PARAGRAPH>

<div class="tldr">
<p class="tldr-label">TL;DR</p>
<ol>
  <li><strong>KEY_POINT_1</strong> — Brief explanation.</li>
  <li><strong>KEY_POINT_2</strong> — Brief explanation.</li>
  <li><strong>KEY_POINT_3</strong> — Brief explanation.</li>
</ol>
</div>

### <FIRST_SECTION_HEADING>

```

## Rules

- Always place new posts in `_drafts/`, never in `_posts/` directly.
- Always prefix the filename with `WIP_`.
- The `title` in frontmatter should preserve the original casing and any special characters (e.g. `#`).
- Leave `categories` and `tags` as empty arrays `[]` unless the user specifies them.
- The post body starts empty after the frontmatter closing `---`.

## References

Use kramdown footnote syntax — **never** use numbered bracket format `[1]` or a `## References` heading.

**Reference key format for research papers:** `first-author-lastname-system-or-concept` (all lowercase, hyphen-separated). Never use plain numbers.

Examples:
- `[^stonebraker-shared-nothing]` — Stonebraker's shared-nothing paper
- `[^dewitt-gamma]` — DeWitt's Gamma database machine
- `[^boncz-monetdb]` — Boncz's MonetDB/X100 paper
- `[^neumann-compilation]` — Neumann's query compilation paper

**Inline citation:**
```markdown
Some claim supported by research.[^stonebraker-shared-nothing] Another point.[^boncz-monetdb]
```

**Footnote definitions** (at the very end of the file, no heading needed — kramdown renders them automatically as a footnotes section):
```markdown
[^stonebraker-shared-nothing]: M. Stonebraker. "The Case for Shared Nothing." *IEEE Database Engineering Bulletin*, 9(1), 1986.
[^boncz-monetdb]: P. Boncz, M. Zukowski, N. Nes. "MonetDB/X100: Hyper-Pipelining Query Execution." *CIDR*, 2005.
```
