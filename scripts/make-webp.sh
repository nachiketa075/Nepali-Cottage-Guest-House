#!/usr/bin/env bash
# Generates responsive WebP variants (640w, 1024w and full width) for every
# JPEG in public/media/photos. Requires ffmpeg built with libwebp.
# Usage: npm run media
set -euo pipefail
cd "$(dirname "$0")/../public/media/photos"
for f in *.jpg; do
  b="${f%.jpg}"
  w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f")
  for t in 640 1024; do
    if [ "$w" -gt "$t" ]; then
      ffmpeg -v error -y -i "$f" -vf "scale=$t:-2:flags=lanczos" -c:v libwebp -quality 78 "$b-$t.webp"
    fi
  done
  ffmpeg -v error -y -i "$f" -c:v libwebp -quality 80 "$b-$w.webp"
  echo "✓ $b (${w}px)"
done
