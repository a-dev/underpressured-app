import type { Table } from "../benchmarks/content";

export const lastChecked = { iso: "2026-11-19", label: "19 November 2026" } as const;

export const title = "Which Mac image compressor should you use?";

export const intro = [
  "This page compares ten tools that make images smaller on a Mac, including ImageOptim, Clop, Zipic, and Squoosh. For each one, you'll find what it does well and how much it costs. Underpressured, the app I make, is included too, and so are the cases where you'd be better off with something else.",
] as const;

export const disclosure =
  "I make Underpressured. Nobody paid to be listed or left out. Every fact about another app comes from that app's own website (link at the end of its description) and my own experience.";

export type Pick = { need: string; apps: string };

export const picks: readonly Pick[] = [
  { need: "Optimize files losslessly, for free, on an older or Intel Mac", apps: "ImageOptim" },
  {
    need: "Turn iPhone HEIC photos into JPEG and nothing more",
    apps: "iMazing Converter or Finder's Convert Image",
  },
  { need: "Compress images as you copy or drag them", apps: "Clop" },
  { need: "Get WebP, AVIF, or JPEG XL output with lots of automation", apps: "Zipic or Clop" },
  { need: "Compress video and PDFs as well as images", apps: "Clop or Compresto" },
  { need: "Optimize photos from inside Lightroom or Photoshop", apps: "JPEGmini" },
  { need: "Compress on a computer where you can't install anything", apps: "TinyPNG or Squoosh" },
  { need: "Tune a single image by eye", apps: "Squoosh" },
  { need: "Watermark, crop, and rename hundreds of files at once", apps: "XnConvert" },
  {
    need: "Resize and compress whole folders from one simple window, with saved presets, for free",
    apps: "Underpressured",
  },
];

export const table: Table = {
  caption: "Mac image compressors at a glance",
  columns: ["App", "Price", "Open source", "Runs on", "Batch", "Writes", "Resize", "Automation"],
  rows: [
    [
      "Underpressured",
      "Free",
      "Yes, MIT",
      "Mac, Apple silicon, macOS 27+",
      "Yes",
      "JPEG, PNG",
      "Yes",
      "None",
    ],
    [
      "ImageOptim",
      "Free",
      "Yes, GPL",
      "Mac, macOS 11+",
      "Yes",
      "Same format as input",
      "No",
      "CLI, Finder Services",
    ],
    [
      "iMazing Converter",
      "Free",
      "No",
      "Mac, Windows",
      "Yes",
      "JPEG, PNG from HEIC",
      "Yes",
      "None",
    ],
    [
      "Clop",
      "Free tier, Pro €15 once",
      "No",
      "Mac, macOS 14+",
      "Yes",
      "Many, incl. WebP, AVIF, JXL",
      "Yes",
      "Clipboard, watched folders",
    ],
    [
      "Zipic",
      "25 a day free, $29.99 once",
      "No",
      "Mac, macOS 13+; Windows beta",
      "Yes",
      "Many, incl. WebP, AVIF, JXL",
      "Yes",
      "Watched folders, Shortcuts, CLI",
    ],
    [
      "Compresto",
      "From $49 once",
      "No",
      "Mac, macOS 13+",
      "Yes",
      "Images, video, PDF",
      "Not listed",
      "Watched folders",
    ],
    [
      "JPEGmini",
      "50 a day free, Pro $59 once",
      "No",
      "Mac, Windows",
      "Yes",
      "JPEG, HEIC",
      "Pro",
      "Watched folders, plugins",
    ],
    [
      "TinyPNG",
      "20 images free, then subscription",
      "No",
      "Web, uploads files",
      "20 at a time",
      "Many, incl. WebP, AVIF, JXL",
      "API only",
      "API, plugins",
    ],
    [
      "Squoosh",
      "Free",
      "Yes, Apache 2.0",
      "Any browser, local",
      "No",
      "Many, incl. WebP, AVIF",
      "Yes",
      "None",
    ],
    [
      "XnConvert",
      "Free for personal use, €15 business",
      "No",
      "Mac, Windows, Linux",
      "Yes",
      "About 70 formats",
      "Yes",
      "Watched folders",
    ],
    [
      "Finder Convert Image",
      "Free, built in",
      "No",
      "Mac, macOS 12+",
      "Yes",
      "JPEG, PNG, HEIF",
      "Small, medium, large",
      "Shortcuts, Automator",
    ],
  ],
  pickRow: 0,
};

export type Tool = {
  id: string;
  name: string;
  url: string;
  summary: string;
  good: readonly string[];
  mind: readonly string[];
};

export const tools: readonly Tool[] = [
  {
    id: "imageoptim",
    name: "ImageOptim",
    url: "https://imageoptim.com/mac",
    summary:
      "ImageOptim is probably the best-known image optimizer for Mac. It's free and open source (GPL) and has been around for years. Drop images on it and it recompresses them in place with a set of well-known tools: MozJPEG, pngquant, Zopfli, Pngcrush, SVGO, and others. It is lossless by default, and lossy compression is a setting.",
    good: [
      "Lossless optimization of JPEG, PNG, GIF, and SVG.",
      "It has lots of PNG settings. In my experience, if you're ready to spend time experimenting with them, you can get PNG files about as small as they go.",
      "Free, with no limits.",
      "A command-line tool, a Finder Services menu, and Sketch integration.",
      "Runs on macOS 11 and later, Intel Macs included.",
    ],
    mind: [
      "It keeps each file in its current format, so it doesn't resize or convert.",
      "It writes over the originals, and there are no saved presets.",
    ],
  },
  {
    id: "imazing-converter",
    name: "iMazing Converter",
    url: "https://imazing.com/converter",
    summary:
      "A free converter from the makers of iMazing. It solves one problem very well: iPhone photos in HEIC and videos in HEVC that other apps and people can't open.",
    good: [
      "HEIC to JPEG or PNG, and HEVC video to H.264 MP4.",
      "Quality and resolution settings, a choice to keep or strip EXIF, and wide-gamut color profiles.",
      "Available for Mac and Windows.",
    ],
    mind: ["It converts Apple's formats and won't compress a JPEG or PNG you already have."],
  },
  {
    id: "clop",
    name: "Clop",
    url: "https://lowtechguys.com/clop/",
    summary:
      "A Mac utility built around compressing files on the move. Copy an image and Clop compresses it right on the clipboard, so you paste a smaller file. Drag files onto its drop zone, which you can call up at the cursor, to compress or convert them. It also handles video and PDFs, and everything runs locally.",
    good: [
      "Clipboard compression and the drag-and-drop zone, both well thought out.",
      "Watched folders for set-and-forget jobs.",
      "Video and PDF compression, and output in WebP, AVIF, and JPEG XL.",
      "Pipelines and preset zones for repeat jobs, plus keyboard shortcuts for resizing.",
      "There's a free tier, and Pro is a one-time €15.",
    ],
    mind: [
      "The free version handles up to 5 dropped files at a time. Batch mode is Pro only, and so is automatic clipboard optimization, according to its pricing table.",
      "The app is closed source, although the encoders it uses are open source.",
      "I like several of its ideas. For me, though, the panels and options take more attention than I want to give a quick job. That's a matter of taste, so try the free version and decide for yourself.",
    ],
  },
  {
    id: "zipic",
    name: "Zipic",
    url: "https://zipic.app/",
    summary: "A polished Mac compressor with a long feature list and many ways to automate it.",
    good: [
      "Many formats: JPEG, PNG, WebP, HEIC, AVIF, JPEG XL, TIFF, GIF, SVG, PDF, and more.",
      "Watched folders, Apple Shortcuts, a Raycast extension, a CLI, and Finder integration.",
      "Works offline on macOS 13+, on Intel and Apple silicon. A Windows version is in beta.",
    ],
    mind: [
      "The free tier allows 25 compressions a day with basic formats, and unlimited use is a one-time $29.99 for 2 devices.",
    ],
  },
  {
    id: "compresto",
    name: "Compresto",
    url: "https://compresto.app/",
    summary:
      "A paid Mac app that compresses video, images, GIFs, and PDFs in one place. It's also on Setapp.",
    good: [
      "One app for many file types, handy if you compress video as often as images.",
      "Watched folders and local processing with Apple silicon acceleration, on macOS 13+.",
    ],
    mind: [
      "One-time licenses start at $49 for one Mac, and there's also a subscription.",
      "If you only work with images, you'd be paying for video features you won't use.",
    ],
  },
  {
    id: "jpegmini",
    name: "JPEGmini",
    url: "https://www.jpegmini.com/",
    summary: "A long-running commercial photo optimizer that's popular with photographers.",
    good: [
      "JPEG and HEIC optimization that tries to keep photos looking the same.",
      "Plugins for Lightroom, Photoshop, and Capture One in the higher tiers.",
      "Watched-folder automations.",
    ],
    mind: [
      "Pro is $59 one-time, and plugins and automations cost more. The free tier is 50 images a day after a trial.",
      "It works with photos only, so there's no PNG support.",
    ],
  },
  {
    id: "tinypng",
    name: "TinyPNG",
    url: "https://tinypng.com/",
    summary:
      "Probably the best-known online compressor. It also has an API and plugins for WordPress and Figma.",
    good: [
      "Nothing to install, so it works on any computer.",
      "Strong PNG results, and output in AVIF, WebP, JPEG XL, PNG, JPEG, and SVG.",
      "The API suits sites that process uploads automatically.",
    ],
    mind: [
      "Your images are uploaded to TinyPNG's servers, and the site says it keeps them for up to 48 hours.",
      "The free web tool takes 20 images at a time, up to 5 MB each, and anything beyond that needs a subscription.",
    ],
  },
  {
    id: "squoosh",
    name: "Squoosh",
    url: "https://squoosh.app/",
    summary:
      "A free, open-source (Apache 2.0) web app from Google Chrome Labs. It runs in your browser and doesn't send your image to a server, though the site uses Google Analytics for basic visit data.",
    good: [
      "Tuning one image by eye, with a slider that shows the original and the result side by side.",
      "Modern formats such as AVIF and WebP, on any operating system.",
    ],
    mind: ["It works on one image at a time, since the web app has no batch mode."],
  },
  {
    id: "xnconvert",
    name: "XnConvert",
    url: "https://www.xnview.com/en/xnconvert/",
    summary: "A powerful cross-platform batch converter from the makers of XnView.",
    good: [
      "Reads more than 500 formats and writes about 70.",
      "Over 80 batch actions: resize, crop, rotate, color, watermarks, metadata, watched folders.",
      "Runs on Windows, macOS, and Linux.",
    ],
    mind: [
      "It's free for private and educational use, and companies need a license (€15 for one seat).",
      "The interface is dense and doesn't feel like a Mac app, and compression is just one action among many.",
    ],
  },
  {
    id: "finder",
    name: "Finder and Preview",
    url: "https://www.macrumors.com/how-to/convert-images-macos-finder/",
    summary:
      "You may not need another app at all. Since macOS 12 Monterey, Finder has a Convert Image quick action. Select images, right-click, and choose Quick Actions, then Convert Image. Pick JPEG, PNG, or HEIF, a size (small, medium, large, or actual size), and whether to keep metadata. Preview can export a single image with a quality slider.",
    good: [
      "Free and already installed on macOS 12 and later.",
      "Fine for a few files now and then, and Preview has offered single-image export for much longer.",
    ],
    mind: [
      "Few controls: no exact pixel size and no quality setting in Convert Image.",
      "Nothing is saved between runs, and Apple's standard encoders aren't tuned for the smallest files.",
    ],
  },
];

export const underpressured = {
  summary:
    "A free, open-source (MIT) Mac app that does one job: makes a batch of images smaller. You pick a preset, choose where the results go, and drop in files or folders, and there isn't much more to it than that.",
  good: [
    "The interface is simple, with one window and a few choices, so there's nothing to learn before your first batch.",
    "Presets keep format, quality, size limit, and metadata together. Four come built in, and you can keep up to 20 and switch between them with Command-1 to Command-9.",
    "You choose what happens to originals: replace them, move them to the Trash, or leave them alone and export copies to another folder with the same subfolders. Name clashes get a suffix, so nothing is overwritten by surprise.",
    "Each result goes to a temporary file first, and saved files keep their original dates, Finder tags, and permissions.",
    "It encodes JPEG with jpegli, lossy PNG with quantizr, and lossless PNG with oxipng, and it resizes with Lanczos in linear light.",
    "It reads HEIC, WebP, AVIF, TIFF, and JPEG XL and writes JPEG or PNG, so it also converts iPhone photos.",
    "If a result would be bigger than the original, the original stays, and files it has already optimized are skipped next time.",
    "There are no limits, accounts, or analytics, and everything runs on your Mac.",
  ],
  mind: [
    "It needs a Mac with Apple silicon and macOS 27 or later. Most apps above run on older systems and Intel Macs.",
    "It writes only JPEG and PNG for now.",
    "It doesn't handle GIF, SVG, RAW, animated images, video, or PDF.",
    "There are no watched folders, clipboard automation, command-line tool, or Shortcuts actions.",
    "It's a young app. If you need more, send feedback through the Support page and I'll try to add it.",
  ],
} as const;

export const fit =
  "I built Underpressured to do one task well and nothing more: make a folder of images smaller with as few decisions as possible. It's for people who process photos or screenshots again and again and want the same result every time. Save your settings as a preset once, then drop a folder. It resizes, converts, and compresses in one pass, keeps your folder structure when you export copies, and never makes a file bigger. It's free and open source, and it doesn't upload anything.";

export const limits: readonly { when: string; instead: string }[] = [
  {
    when: "Your Mac has an Intel chip or runs macOS 26 or earlier.",
    instead: "Underpressured won't run there, but ImageOptim, Clop, Zipic, and XnConvert will.",
  },
  {
    when: "You need WebP, AVIF, or HEIC output.",
    instead:
      "Underpressured writes only JPEG and PNG for now. Look at Clop, Zipic, Squoosh, or TinyPNG.",
  },
  {
    when: "You want images compressed as you copy or drag them.",
    instead: "Clop is built around this.",
  },
  {
    when: "You work with video, GIFs, SVG, or PDFs.",
    instead: "Clop, Compresto, and Zipic cover these. ImageOptim handles GIF and SVG.",
  },
  {
    when: "You edit photos in Lightroom or Photoshop and want to optimize on export.",
    instead: "JPEGmini has plugins for both.",
  },
  {
    when: "You only need to convert a few iPhone photos.",
    instead: "Finder's Convert Image action is already on your Mac.",
  },
];

export type Faq = { question: string; answer: string; link?: { text: string; href: string } };

export const faq: readonly Faq[] = [
  {
    question: "What is a good free alternative to ImageOptim on a Mac?",
    answer:
      "On an Apple silicon Mac with macOS 27, Underpressured is free and open source like ImageOptim, and it adds resizing, format conversion, and saved presets. On an older or Intel Mac, ImageOptim is still the best free choice. Squoosh works in any browser if you only have one image.",
  },
  {
    question: "Is Underpressured a replacement for ImageOptim?",
    answer:
      "For JPEG and PNG on a recent Apple silicon Mac, yes. ImageOptim still handles GIF and SVG and runs on older Macs.",
  },
  {
    question: "Does Underpressured compress better than other apps?",
    answer:
      "It depends on the images and the settings. My benchmarks compare Underpressured's encoders with Apple's encoder and with pngquant. I haven't run a like-for-like test against other apps yet, so I don't claim that.",
    link: { text: "Read the benchmarks", href: "/benchmarks" },
  },
  {
    question: "Can I compress images on a Mac without installing anything?",
    answer:
      "Yes. Finder's Convert Image quick action can shrink and convert images, and Preview exports single images with a quality slider. In a browser, Squoosh works locally and TinyPNG uploads the files to its servers.",
  },
  {
    question: "Which Mac image compressors keep my files private?",
    answer:
      "Underpressured, ImageOptim, Clop, Zipic, Compresto, XnConvert, and Finder all process images on your Mac. Squoosh runs in the browser without uploading. TinyPNG uploads images to its servers.",
  },
  {
    question: "Why is Underpressured free?",
    answer: "It's an open-source project under the MIT license. There are no paid tiers.",
  },
];

export const outro =
  "If you're still unsure, run two apps on copies of the same folder and compare the results. Underpressured shows the size change for every file.";
