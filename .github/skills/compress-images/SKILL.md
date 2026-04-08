---
name: compress-images
description: "Use when: compressing images, reducing image file size, optimizing images for the web, shrinking PNGs or JPEGs, reducing page weight from images. Uses macOS sips to resize and re-encode images without noticeable quality loss."
---

# Compress Images

## Tool

Use macOS built-in `sips` — no install required.

## Settings (do not go more aggressive without user confirmation)

| Format | Max longest edge | Quality |
|--------|-----------------|---------|
| JPEG   | 1200 px         | 90%     |
| PNG    | 1200 px         | —       |

These values keep images visually indistinguishable from the originals while cutting file sizes by 60–80%.
Do **not** lower quality below 90% or resize below 1200 px unless the user explicitly asks.

## Workflow

1. **List the target directory** to identify all images:
   ```bash
   ls -lh assets/img/<subdir>/
   ```

2. **Note filenames with spaces** — they must be individually quoted in all commands below.

3. **Create a unique backup folder in /tmp** and copy originals into it before touching anything:
   ```bash
   BACKUP_DIR=$(mktemp -d /tmp/compress-images-XXXXXX)
   cp file1.jpeg file2.png "$BACKUP_DIR/"
   ```
   Confirm the copies are there before proceeding:
   ```bash
   ls -lh "$BACKUP_DIR/"
   ```
   Note the `$BACKUP_DIR` path — you will need it in step 8.

4. **Compress JPEGs** (resize + re-encode):
   ```bash
   cd assets/img/<subdir>
   sips -Z 1200 --setProperty formatOptions 90 file1.jpeg file2.jpeg
   ```

5. **Compress PNGs** (resize only — sips does not re-encode PNG quality):
   ```bash
   sips -Z 1200 file1.png file2.png
   ```

6. **Verify sizes** after compression and report before/after to the user:
   ```bash
   ls -lh
   ```

7. **Ask the user if they are satisfied** with the results. Do not proceed to the next step until they confirm.

8. **Delete the backup folder** only after the user confirms:
   ```bash
   rm -rf "$BACKUP_DIR"
   ```

9. **Update any image references** in post files if filenames were also renamed.

## Rules

- Always run `sips` from the directory containing the images, or quote the full path.
- Files with spaces in their names must be **individually quoted**: `"My File.jpeg"` — do not rely on glob expansion.
- Always **create a unique subfolder** with `mktemp -d /tmp/compress-images-XXXXXX` and copy originals there before running `sips`. Verify the copies exist before compressing. Never dump files directly into `/tmp` root.
- Always **ask the user for confirmation** before deleting the /tmp backups. Never auto-delete.
- `sips` **overwrites in-place**. The /tmp backup is the only safety net if the originals are not committed to git.
- Do not compress images that are already small (< 200 KB) — the savings are negligible and re-encoding degrades quality unnecessarily.
- PNG compression via `sips -Z` only resizes; it does not reduce bit depth or palette. For further PNG reduction, a separate tool (e.g. `pngquant`) would be needed — do not use without user confirmation.
- After compressing, always report the before/after sizes so the user can judge the result.
