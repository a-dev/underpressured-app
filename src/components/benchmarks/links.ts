// content.ts marks a library as [Name]. Only the first mention becomes a link.
export const libraries: Readonly<Record<string, string>> = {
  SSIMULACRA2: "https://github.com/cloudinary/ssimulacra2",
  Butteraugli: "https://github.com/google/butteraugli",
  ImageIO: "https://developer.apple.com/documentation/imageio",
  jpegli: "https://github.com/google/jpegli",
  oxipng: "https://github.com/oxipng/oxipng",
  quantizr: "https://github.com/DarthSim/quantizr",
  pngquant: "https://github.com/kornelski/pngquant",
  Zopfli: "https://github.com/google/zopfli",
  vImage: "https://developer.apple.com/documentation/accelerate/vimage",
  "Core Graphics": "https://developer.apple.com/documentation/coregraphics",
  libjxl: "https://github.com/libjxl/libjxl",
};

export type Segment = { text: string; href?: string };

export function linkify(text: string): Segment[] {
  const [head, ...rest] = text.split("[");
  const segments: Segment[] = [{ text: head }];
  for (const part of rest) {
    const end = part.indexOf("]");
    if (end === -1) throw new Error(`Unclosed [ in "${text}"`);
    const name = part.slice(0, end);
    const href = libraries[name];
    if (!href) throw new Error(`No link for [${name}]`);
    segments.push({ text: name, href }, { text: part.slice(end + 1) });
  }
  return segments;
}
