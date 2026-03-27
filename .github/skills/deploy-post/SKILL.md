---
name: deploy-post
description: "Use when: publishing a post, deploying a draft, moving a post from drafts to live, removing the WIP prefix, promoting a draft post. Removes the WIP_ prefix from a draft file in _posts_drafts/ and moves it to _posts/ so it is published on the website."
---

# Deploy Blog Post

## Workflow

1. **Identify the post to deploy.** If the user does not specify a filename, list the files in `_posts_drafts/` that start with `WIP_` and ask which one to deploy.

2. **Determine the new filename** by stripping the `WIP_` prefix:
   ```
   _posts_drafts/WIP_2026-03-23-my-post.markdown
               ↓
   _posts/2026-03-23-my-post.markdown
   ```

3. **Move the file** using the terminal:
   ```bash
   mv _posts_drafts/WIP_<slug>.markdown _posts/<slug>.markdown
   ```

4. **Confirm** the new file path to the user and note that the post will be live on the next site build.

## Rules

- Never edit the file contents during deployment.
- The destination is always `_posts/`, never a subdirectory.
- If a file with the same name already exists in `_posts/`, warn the user before overwriting.
- Ask for confirmation before executing the move if the user has not explicitly said to proceed.
