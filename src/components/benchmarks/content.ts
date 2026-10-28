export type Bar = {
  label: string;
  value: number;
  display: string;
  pick?: boolean;
};

export type Table = {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  pickRow?: number;
};

export const intro =
  "These tests compare the image-processing methods in Underpressured. The results include file sizes, quality scores, and processing times. Each comparison includes the test conditions and limits. The measurements describe this test set and machine. Results on your images and Mac may differ. [SSIMULACRA2] and [Butteraugli] score each output against its source file.";

export const stats = [
  { value: "−11%", label: "smaller JPEG files than [ImageIO] at the same quality" },
  { value: "4.45 s", label: "for Underpressured to resize and encode 100 photos of 12 MP" },
  { value: "28%", label: "smaller screenshots, with every pixel unchanged" },
  { value: "+10", label: "SSIMULACRA2 points when the resize uses linear light, not gamma space" },
] as const;

export const setup = [
  { term: "Machine", text: "Apple M2 (4 performance + 4 efficiency cores), 16 GB, macOS 27." },
  {
    term: "Images",
    text: "40 files with open licenses from Wikimedia Commons. The set has 20 photos of 12 to 50 MP, 10 UI screenshots, 5 PNGs with transparency, and 5 edge cases, such as 16-bit grayscale.",
  },
  {
    term: "SSIMULACRA2",
    text: "Measures how similar the output looks to the source. Higher is better, and 100 means identical. At 90 and above, you cannot see a difference at 1:1 zoom.",
  },
  {
    term: "Butteraugli",
    text: "Measures how different the output looks from the source. Lower is better.",
  },
] as const;

export type Section = {
  id: string;
  label: string;
  title: string;
  lead: string;
  verdict: string;
  chart?: { title: string; note: string; max: number; bars: readonly Bar[] };
  table: Table;
  notes: readonly string[];
};

export const sections: readonly Section[] = [
  {
    id: "jpeg",
    label: "JPEG",
    title: "jpegli vs. Apple ImageIO",
    lead: "For each photo, each encoder searches for the lowest Quality that still reaches the target SSIMULACRA2 score. Then the file sizes are compared.",
    verdict:
      "At the same quality, [jpegli] files are 11 to 14% smaller. At score 90, they are less than half the size.",
    chart: {
      title: "jpegli file size as a share of ImageIO, same score",
      note: "Median per file. ImageIO is 100%.",
      max: 100,
      bars: [
        { label: "Score 70", value: 86.2, display: "86%", pick: true },
        { label: "Score 80", value: 89.0, display: "89%", pick: true },
        { label: "Score 90", value: 44.7, display: "45%", pick: true },
      ],
    },
    table: {
      caption:
        "Median per file over 20 photos. Size is the jpegli size divided by the ImageIO size. Pairs show jpegli / ImageIO.",
      columns: ["Target", "Files", "Size", "Quality", "Butteraugli"],
      rows: [
        ["70", "20", "0.862", "57.5 / 41", "3.17 / 3.85"],
        ["80", "20", "0.890", "84.5 / 59", "2.08 / 2.44"],
        ["90", "9 reached by both", "0.447", "98 / 100", "—"],
      ],
    },
    notes: [
      "At score 90, ImageIO missed the target on 11 of 20 photos, even at Quality 100. jpegli missed the target on 7.",
      "At the same SSIMULACRA2 score, jpegli also has the lower Butteraugli distance. The size gain does not depend on one metric.",
      "The two Quality scales are different. At SSIMULACRA2 80, jpegli Quality 85 gives about the same result as ImageIO Quality 59.",
    ],
  },
  {
    id: "png-lossy",
    label: "PNG, lossy",
    title: "quantizr vs. pngquant",
    lead: "Both quantizers were run on 10 screenshots and 5 PNGs with transparency. Each run used a palette of 16, 32, 64, 128, or 256 colors and a dithering level of 0, 0.5, or 1. [oxipng] then optimized each output. For each file, the result is the smallest output that reached the target.",
    verdict:
      "Where both reach the target, [quantizr] files are 11 to 13% smaller at scores 80 and 85. quantizr also has a permissive license.",
    chart: {
      title: "quantizr file size as a share of [pngquant]",
      note: "Median over the files where both quantizers reached the target. pngquant is 100%.",
      max: 110,
      bars: [
        { label: "Score 80", value: 87.3, display: "87% · 11 files", pick: true },
        { label: "Score 85", value: 88.8, display: "89% · 6 files", pick: true },
        { label: "Score 90", value: 102.0, display: "102% · 2 files", pick: true },
      ],
    },
    table: {
      caption: "Median SSIMULACRA2 of quantizr by palette size and dithering",
      columns: ["Colors", "Dither 0", "Dither 0.5", "Dither 1"],
      rows: [
        ["16", "22", "26", "32"],
        ["32", "47", "51", "57"],
        ["64", "63", "70", "74"],
        ["128", "76", "79", "80"],
        ["256", "83", "85", "85"],
      ],
    },
    notes: [
      "A fixed palette size does not work. At 64 colors, the score goes from 33 to over 80, depending on the image.",
      "The app tries palettes from small to large. It keeps the first palette that reaches the score jpegli gets at the same Quality. If no palette reaches that score, or the file is not smaller, the image keeps full color.",
      "At the default Web Preset Quality, 4 of 10 screenshots keep full color. Text and UI gradients need more than 256 colors.",
      "pngquant has a GPL-3 license. It was used only for comparison and is not part of the app.",
    ],
  },
  {
    id: "png-lossless",
    label: "PNG, lossless",
    title: "oxipng compression levels",
    lead: "oxipng compresses a PNG again without changing its pixels. Higher levels try more compression strategies. A pixel-by-pixel check found every output identical to its source.",
    verdict: "Level 2 saves 28.4% in 17.6 s. Level max saves 29.9%, but takes 209.5 s.",
    chart: {
      title: "Time to optimize 10 screenshots on one core",
      note: "Total seconds for 9.5 MB of screenshots.",
      max: 210,
      bars: [
        { label: "-o 2", value: 17.6, display: "17.6 s · 28.4% saved", pick: true },
        { label: "-o 4", value: 32.8, display: "32.8 s · 29.7% saved" },
        { label: "-o max", value: 209.5, display: "209.5 s · 29.9% saved" },
      ],
    },
    table: {
      caption: "Screenshots, 10 files, 9.5 MB",
      columns: [
        "Level",
        "Median saved",
        "Total saved",
        "Median ms, all cores",
        "Median ms, one core",
      ],
      rows: [
        ["-o 2 (default)", "33.8%", "28.4%", "1,269", "1,544"],
        ["-o 4", "35.8%", "29.7%", "2,376", "3,094"],
        ["-o max", "36.4%", "29.9%", "5,738", "20,082"],
      ],
      pickRow: 0,
    },
    notes: [
      "[Zopfli] saves about 3% more than level max, but takes 40 to 85 s for each 1 MB file. The app does not offer it.",
      "The app processes several images at the same time, so the time on one core is the important number. At level 2, a typical file takes 1.5 to 3.7 s.",
      "A 37 MB 16-bit grayscale file gets 0.5% smaller at every level. On this file, higher levels only add time.",
    ],
  },
  {
    id: "resize",
    label: "Resize",
    title: "Resizing in linear light",
    lead: "Four ways to make an image smaller on macOS were compared: [vImage] in linear light, vImage in gamma space, ImageIO thumbnails, and [Core Graphics]. The target sizes were 2048 px and 1280 px on the long edge. The reference is a hand-written Lanczos-4 filter that works in linear light.",
    verdict: "vImage Lanczos in linear light gives the best score on every image.",
    chart: {
      title: "SSIMULACRA2 against the reference, photos at 2048 px",
      note: "Median over 20 photos. Higher is better.",
      max: 100,
      bars: [
        { label: "vImage, linear light", value: 92.88, display: "92.9", pick: true },
        { label: "vImage, gamma space", value: 82.14, display: "82.1" },
        { label: "ImageIO thumbnail", value: 70.29, display: "70.3" },
        { label: "Core Graphics", value: 68.77, display: "68.8" },
      ],
    },
    table: {
      caption: "Median SSIMULACRA2 with the lowest score in brackets, and median ms per photo",
      columns: ["Method", "Photos 2048", "Photos 1280", "Screenshots 1280", "Photo ms, 2048"],
      rows: [
        ["vImage, linear light", "92.9 (91.6)", "93.9 (90.7)", "90.8 (87.6)", "169"],
        ["vImage, gamma space", "82.1 (71.8)", "77.4 (63.2)", "61.7 (18.9)", "98"],
        ["ImageIO thumbnail", "70.3 (46.5)", "65.4 (34.7)", "53.8 (12.8)", "66"],
        ["Core Graphics", "68.8 (56.4)", "63.2 (47.9)", "54.5 (14.7)", "112"],
      ],
      pickRow: 0,
    },
    notes: [
      "Resizing gamma-encoded pixels makes fine detail darker or lighter, for example text, foliage, and highlights. A bigger size reduction gives a bigger error.",
      "Linear light adds 60 to 70 ms per photo. For a 50 MP photo, peak memory is 1.3 GB, against 602 MB in gamma space.",
    ],
  },
  {
    id: "speed",
    label: "Speed",
    title: "100 photos, start to finish",
    lead: "Underpressured decoded 100 photos of about 12 MP, four at a time. It resized each photo to 2048 px in linear light, encoded it with jpegli at Quality 80, and wrote it to disk.",
    verdict: "Underpressured takes 4.45 s on M2. The target is 30 s on a base M1.",
    chart: {
      title: "Median time per photo by stage",
      note: "Milliseconds, with four photos in progress at the same time.",
      max: 100,
      bars: [
        { label: "Decode", value: 31.8, display: "31.8 ms" },
        { label: "Resize", value: 95.0, display: "95.0 ms" },
        { label: "Encode", value: 21.3, display: "21.3 ms" },
        { label: "Write", value: 0.5, display: "0.5 ms" },
      ],
    },
    table: {
      caption: "Wall time for the full batch of 100 photos",
      columns: ["Run", "Seconds"],
      rows: [
        ["1", "4.359"],
        ["2", "4.452"],
        ["3", "4.492"],
        ["Median", "4.452"],
      ],
      pickRow: 3,
    },
    notes: [
      "This is about 22 photos per second. Peak memory is about 0.8 GB.",
      "For a base M1, the same batch is estimated at 5.3 s. If memory bandwidth slows it more than expected, the estimate is 6.7 s. Both are less than a quarter of the 30 s target.",
      "The queue is not a bottleneck. It schedules 10,000 items in 89 ms.",
    ],
  },
];

export const tools = {
  caption: "Pinned versions",
  columns: ["Tool", "Version", "License"],
  rows: [
    ["SSIMULACRA2, Butteraugli", "[libjxl] 0.12.0", "BSD-3"],
    ["jpegli", "commit 031a007", "BSD-3"],
    ["oxipng", "10.2.1", "MIT"],
    ["quantizr", "1.4.3", "MIT-style"],
    ["pngquant (comparison only)", "3.0.3", "GPL-3.0"],
  ],
} as const satisfies Table;

export const caveats = [
  "Most timings come from single runs on a machine that also ran other benchmarks. Treat differences under 10% as noise. The rankings stayed the same between runs.",
  "The scores measure how close each output is to its source. They do not measure taste. I also checked the PNG results by eye.",
  "All inputs were in the disk cache. The tests did not cover HEIC or RAW decoding.",
];
