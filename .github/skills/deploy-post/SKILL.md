---
name: deploy-post
description: "Use when: publishing a post, deploying a draft, moving a post from drafts to live, removing the WIP prefix, promoting a draft post. Removes the WIP_ prefix from a draft file in _drafts/, updates the date to today, sets the label, and moves it to _posts/ so it is published on the website."
---

# Deploy Blog Post

## Workflow

1. **Identify the post to deploy.** If the user does not specify a filename, list the files in `_drafts/` that start with `WIP_` and ask which one to deploy.

2. **Update the `date` frontmatter** to today's date using `replace_string_in_file`:
   ```
   date: YYYY-MM-DD 00:00:00 -0700
   ```

3. **Set the `label` frontmatter field.** Every post must have exactly one label. Infer it from the post content if the user does not specify one, then confirm your choice with the user before proceeding. The four valid values are:

   | Label        | Color  | Use for                                              |
   |--------------|--------|------------------------------------------------------|
   | `technical`  | blue   | Code deep-dives, algorithm walkthroughs, library internals |
   | `conference` | silver | Conference coverage, keynote summaries, event recaps |
   | `analysis`   | amber  | Benchmarks, comparisons, data-driven investigations  |
   | `industry`   | green  | Funding, company news, industry trends               |

   Add or update the `label` field in the frontmatter:
   ```yaml
   label: technical
   ```

4. **Determine the new filename** by stripping the `WIP_` prefix and updating the date prefix to today:
   ```
   _drafts/WIP_2026-03-23-my-post.markdown
               ↓
   _posts/2026-03-31-my-post.markdown
   ```

5. **Move the file** using the terminal:
   ```bash
   mv _drafts/WIP_<old-date>-<slug>.markdown _posts/<today-date>-<slug>.markdown
   ```

6. **Confirm** the new file path and the label used. Note that the post will be live on the next site build.

## Rules

- Always update both the frontmatter `date` field AND the filename to today's date — they must stay in sync.
- Preserve the time (`00:00:00 -0700`) when updating the date.
- The `label` field must be one of: `technical`, `conference`, `analysis`, `industry`. No other values are valid.
- The destination is always `_posts/`, never a subdirectory.
- If a file with the same name already exists in `_posts/`, warn the user before overwriting.
- Ask for confirmation before executing the move if the user has not explicitly said to proceed.
