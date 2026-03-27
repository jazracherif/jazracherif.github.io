---
name: create-new-post
description: "Use when: creating a new blog post, adding a new draft post, writing a new article. Creates a new post file in _posts_drafts/ using the standard template with the correct frontmatter, filename format, and WIP prefix."
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

3. **Create the file** at `_posts_drafts/<filename>` using the template below.

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

- Always place new posts in `_posts_drafts/`, never in `_posts/` directly.
- Always prefix the filename with `WIP_`.
- The `title` in frontmatter should preserve the original casing and any special characters (e.g. `#`).
- Leave `categories` and `tags` as empty arrays `[]` unless the user specifies them.
- The post body starts empty after the frontmatter closing `---`.
