#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <image1> [image2 ...]"
  exit 1
fi

echo "Images to process:"
files=()
for f in "$@"; do
  if [ ! -f "$f" ]; then
    echo "  [Not Found] $f"
    continue
  fi
  
  # Check file size (skip if < 200KB)
  # Ensure we handle spaces gracefully by quoting "$f"
  size_bytes=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null || echo 0)
  if [ "$size_bytes" -eq 0 ]; then
      echo "  [Error] Could not determine size of $f"
      continue
  fi
  size_kb=$((size_bytes / 1024))
  
  if [ "$size_kb" -lt 200 ]; then
    echo "  [Skipping]  $f ($size_kb KB is < 200 KB)"
  else
    echo "  [To Compress] $f ($size_kb KB)"
    files+=("$f")
  fi
done

if [ ${#files[@]} -eq 0 ]; then
  echo "No images to compress. Exiting."
  exit 0
fi

echo ""
read -p "Proceed with compressing these ${#files[@]} images? (Y/n) " -r
echo
[[ -z "$REPLY" ]] && REPLY="y"
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# Create backup
BACKUP_DIR=$(mktemp -d /tmp/compress-images-XXXXXX)
echo "Created backup directory: $BACKUP_DIR"

for f in "${files[@]}"; do
  cp "$f" "$BACKUP_DIR/"
done

# Verify copies
echo "Backups created:"
ls -lh "$BACKUP_DIR/"

echo ""
echo "Compressing..."
# associative array won't work cleanly across all macOS bash versions (bash 3.2),
# so we'll use parallel arrays or just rely on a file mapping. Since macOS bash is old:
for f in "${files[@]}"; do
  # get before size
  b_kb=$(( $(stat -f%z "$f" 2>/dev/null || stat -c%s "$f") / 1024 ))
  
  ext=$(echo "${f##*.}" | tr '[:upper:]' '[:lower:]')
  
  # Get dimensions
  width=$(sips --getProperty pixelWidth "$f" | awk '/pixelWidth/ {print $2}' || true)
  height=$(sips --getProperty pixelHeight "$f" | awk '/pixelHeight/ {print $2}' || true)
  
  # Ensure we got valid numbers
  if ! [[ "$width" =~ ^[0-9]+$ ]] || ! [[ "$height" =~ ^[0-9]+$ ]]; then
    echo "  [Error] Could not determine dimensions for $f. Skipping."
    continue
  fi
  
  longest_edge=$width
  if [ "$height" -gt "$width" ]; then
    longest_edge=$height
  fi
  
  resize_arg=""
  # If longest edge is <= 1400, skip resizing (preserving text clarity on screenshots)
  if [ "$longest_edge" -gt 1400 ]; then
    resize_arg="-Z 1200"
  fi
  
  if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
    if [ -n "$resize_arg" ]; then
      sips $resize_arg --setProperty formatOptions 90 "$f" >/dev/null 2>&1
      echo "  [JPEG] Resized to 1200px and re-encoded $f"
    else
      sips --setProperty formatOptions 90 "$f" >/dev/null 2>&1
      echo "  [JPEG] Re-encoded (longest edge $longest_edge <= 1400px, skipped resize) $f"
    fi
  elif [[ "$ext" == "png" ]]; then
    if [ -n "$resize_arg" ]; then
      sips $resize_arg "$f" >/dev/null 2>&1
      echo "  [PNG] Resized to 1200px $f"
    else
      echo "  [PNG] Skipped (longest edge $longest_edge <= 1400px, nothing to do for PNG) $f"
    fi
  else
    echo "  [Unknown] Unsupported extension $ext for $f. Skipped."
  fi
  
  a_kb=$(( $(stat -f%z "$f" 2>/dev/null || stat -c%s "$f") / 1024 ))
  if [ "$b_kb" -gt 0 ]; then
    savings=$(( 100 - (a_kb * 100 / b_kb) ))
  else
    savings=0
  fi
  echo "         Result: ${b_kb}KB -> ${a_kb}KB ($savings% reduction)"
done

echo ""
read -p "Are you satisfied with the results? (Y/n) " -r
echo
[[ -z "$REPLY" ]] && REPLY="y"
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf "$BACKUP_DIR"
  echo "Backup cleanly removed. Done."
else
  echo "Restoring originals from backup..."
  for f in "${files[@]}"; do
    base=$(basename "$f")
    cp "$BACKUP_DIR/$base" "$f"
  done
  echo "Restored. (Backup copies remain at $BACKUP_DIR)"
fi
