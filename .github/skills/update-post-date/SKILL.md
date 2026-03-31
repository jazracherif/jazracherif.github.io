---
name: update-post-date
description: "Use when: updating the date of a post, changing a post's publish date, setting a post to today's date, renaming a post file to match a new date. Updates the date frontmatter field and renames the file to keep the filename date in sync."
---

# Update Post Date

## Workflow

1. **Identify the post to update.** If the user does not specify a file, list posts in `_posts/` and `_drafts/` and ask which one to update.

2. **Determine the new date.** If the user says "today", use the current date (`YYYY-MM-DD`).

3. **Update the `date` field** in the frontmatter using `replace_string_in_file`:
   ```
   date: YYYY-MM-DD 00:00:00 -0700
   ```

4. **Rename the file** to match the new date using the terminal:
   ```bash
   mv _posts/<old-date>-<slug>.markdown _posts/<new-date>-<slug>.markdown
   ```
   Keep the slug (everything after the date prefix) unchanged.

5. **Confirm** the updated date and new file path to the user.

## Rules

- Always update both the frontmatter `date` field AND the filename — they must stay in sync.
- Preserve the time (`00:00:00 -0700`) when updating the date.
- Never change any other file content.
- If the file is in `_drafts/`, apply the same rename logic with the `WIP_` prefix preserved.
