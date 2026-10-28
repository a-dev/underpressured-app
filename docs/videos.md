# Videos

The home page shows three feature videos.

| Path | Content |
| --- | --- |
| `docs/design/video-sources/` | Original recordings. Do not publish. |
| `public/videos/` | Compressed MP4 files and JPEG posters. The site serves these. |

## Update a video

1. Put the new recording in `docs/design/video-sources/`.
2. Install FFmpeg and run:

   ```bash
   bash scripts/compress-videos.sh
   ```

3. The script writes H.264 MP4 files with no audio, and a 1280px poster from second 4.
4. If the deployed file changes, increment the `-v1` suffix in the script and in `src/components/home/content.ts`. Browsers cache the old name.

Cloudflare serves the files as static assets. One file can be up to 25 MiB.
