#!/usr/bin/env bash
set -euo pipefail

# Works from any directory. Does not change the originals.
project_root="$(cd "$(dirname "$0")/.." && pwd)"
source_dir="$project_root/docs/design/video-sources"
output_dir="$project_root/public/videos"
mkdir -p "$output_dir"

for source in "$source_dir"/*.mp4; do
  name="$(basename "$source" .mp4)-v1"
  ffmpeg -hide_banner -loglevel error -y -i "$source" \
    -map 0:v:0 -an -map_metadata -1 \
    -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
    -movflags +faststart "$output_dir/$name.mp4"
  ffmpeg -hide_banner -loglevel error -y -ss 4 -i "$output_dir/$name.mp4" \
    -frames:v 1 -vf scale=1280:-2 -q:v 3 "$output_dir/$name.jpg"
done
