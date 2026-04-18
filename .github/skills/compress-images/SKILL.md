---
name: compress-images
description: "Use when: compressing images, reducing image file size, optimizing images for the web, shrinking PNGs or JPEGs, reducing page weight from images. Also use when: adding an image (e.g. 'add image X') — always compress before inserting the image tag. Uses macOS sips to resize and re-encode images without noticeable quality loss."
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

**Screenshots with text:** Check the original pixel dimensions with `sips --getProperty pixelWidth` before resizing. If the longest edge is already ≤ 1400 px, skip the resize step entirely — resizing screenshots down causes blurry text. Do **not** use `-Z` in a way that would upscale the image.

## Workflow

1. **List the target directory** to identify all images:
   ```bash
   ls -lh assets/img/<subdir>/
   ```

2. **Rename screenshots to clean, descriptive names based on context:**
   - Use the surrounding markdown content, the image content, or the user's intent to pick a short, descriptive name (e.g. `zoho-t1-execution-time.png`).
   - **macOS "Screenshot" files have a hidden character:** macOS inserts a **narrow no-break space (U+202F)** between the time and AM/PM (e.g. `Screenshot 2026-04-13 at 2.40.18 PM.png`). **Never try to type or paste these filenames directly.** Instead, use zsh `(@f)` flag to load paths into an array safely, then reference by index to rename:
     ```zsh
     FILES=("${(@f)$(find "$DIR" -name "Screenshot*.png" | sort)}")
     mv "${FILES[1]}" "$DIR/my-descriptive-name-1.png"
     mv "${FILES[2]}" "$DIR/my-descriptive-name-2.png"
     ```
   - **Always rename** to a clean name *before* running the compression script below so all subsequent steps use safe filenames.

3. **Run the interactive `compress-images.sh` script** with the list of files to process:
   ```bash
   bash .github/skills/compress-images/compress-images.sh assets/img/<subdir>/file1.jpeg assets/img/<subdir>/file2.png
   ```

4. **Follow the interactive prompts:**
   - The script will skip files < 200KB.
   - It calculates dimensions and skips resizing for screenshots/images whose longest edge is ≤ 1400px.
   - It will create a backup, process the images, show before/after sizes.
   - Finally, it will ask if you are satisfied. If you say `n`, it restores them.

5. **Update any image references** in post files if filenames were also renamed.

## Rules

- Always run `bash .github/skills/compress-images/compress-images.sh` instead of manual `sips` commands when possible.
- Files with spaces in their names must be **individually quoted**: `"My File.jpeg"` — do not rely on glob expansion.
- Do not compress images that are already small (< 200 KB) — the script handles this automatically.
- PNG compression via `sips -Z` only resizes; it does not reduce bit depth or palette. For further PNG reduction, a separate tool (e.g. `pngquant`) would be needed — do not use without user confirmation.
