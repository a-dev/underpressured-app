export const intro =
  "Underpressured is a free, open-source app for Mac. It compresses, converts, and resizes images. Add a folder. Choose your settings. Process the images together. You can also process a single image. Save a preset to reuse your settings. Choose where to save the results. Compare file sizes after Underpressured completes the batch.";

export const appLanguages =
  "The app supports English, Spanish, Brazilian Portuguese, German, French, Arabic, Japanese, and Simplified Chinese.";

export const codecs = [
  {
    name: "jpegli",
    format: "JPEG",
    text: "Progressive encode at the preset quality. Lossless mode rewrites the file without touching its coefficients; resized or converted JPEGs get a visually lossless encode.",
  },
  {
    name: "quantizr",
    format: "PNG, lossy",
    text: "Searches for a smaller palette and keeps it only when the result stays above a quality floor. Otherwise it falls back to full color.",
  },
  {
    name: "oxipng",
    format: "PNG, lossless",
    text: "Optimizes the file at level 2 without changing a single pixel.",
  },
  {
    name: "vImage Lanczos",
    format: "Resize",
    text: "Resizes in linear light and keeps the aspect ratio. Images are never enlarged.",
  },
] as const;

export const features = [
  {
    id: "presets",
    videoSrc: "/videos/underpressured-1-v1.mp4",
    videoPoster: "/videos/underpressured-1-v1.jpg",
    title: "Presets",
    lead: "For when “same as last time” is exactly what you want.",
    text: "Save the output format (JPEG, PNG, or the original), the compression (lossy or lossless), and resizing by width, height, or the longer side. Then pick the whole setup in one click.",
    video:
      'A copy of "Balanced JPEG" preset becomes a new "Website images" with its own quality and resize settings.',
  },
  {
    id: "place",
    videoSrc: "/videos/underpressured-2-v1.mp4",
    videoPoster: "/videos/underpressured-2-v1.jpg",
    title: "Place",
    lead: "Smaller files shouldn't mean a bigger mess.",
    text: "Replace the originals without a trace, send them to the system Trash, or leave them alone and save the compressed copies anywhere you want. Nested folders keep their structure.",
    video:
      "Compressed copies go into a separate export folder with the same subfolders as the original.",
  },
  {
    id: "result",
    videoSrc: "/videos/underpressured-3-v1.mp4",
    videoPoster: "/videos/underpressured-3-v1.jpg",
    title: "Result",
    lead: "See how much weight each image lost.",
    text: "Underpressured lists the new size and the percentage of change. It's interactive too: preview with Quick Look, open a file, or reveal it in Finder.",
    video:
      "Quick Look previews the compressed images. This batch of 21 images takes up 95% less space.",
  },
] as const;
