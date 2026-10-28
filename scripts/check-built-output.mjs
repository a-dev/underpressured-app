import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const outputDirectory = path.resolve(process.argv[2] ?? "dist");
const siteOrigin = "https://underpressured.app";
const errors = [];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

function attributes(tag) {
  const result = new Map();
  const pattern = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of tag.matchAll(pattern)) {
    if (match[1].toLowerCase() !== "<") {
      result.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
    }
  }
  return result;
}

function decoded(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function pageBase(file) {
  const relativePath = path.relative(outputDirectory, file).replace(/index\.html$/, "");
  return `${siteOrigin}/${relativePath}`;
}

function fail(file, message) {
  errors.push(`${path.relative(outputDirectory, file)}: ${message}`);
}

function htmlFileForUrl(url) {
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname.replace(/^\/+/, "");
  const candidates = pathname.endsWith("/")
    ? [path.join(outputDirectory, relativePath, "index.html")]
    : [
        path.join(outputDirectory, relativePath),
        path.join(outputDirectory, `${relativePath}.html`),
        path.join(outputDirectory, relativePath, "index.html"),
      ];
  return candidates.find((candidate) => htmlFiles.has(candidate));
}

let allFiles;
try {
  allFiles = await filesUnder(outputDirectory);
} catch (error) {
  console.error(`Cannot read build output at ${outputDirectory}: ${error.message}`);
  process.exit(1);
}

const htmlFiles = new Set(allFiles.filter((file) => file.endsWith(".html")));
const idsByFile = new Map();
const htmlByFile = new Map();
const noindexPages = new Set();
const internalLinks = [];
const localAssetReferences = [];
const sitemapFiles = allFiles.filter((file) => /sitemap(?:-[\w-]+)?\.xml$/.test(file));

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  htmlByFile.set(file, html);
  const ids = new Set();
  const elements = html.match(/<[a-z][^>]*>/gi) ?? [];
  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)];
  const descriptions = elements
    .map((tag) => ({ tag, attrs: attributes(tag) }))
    .filter(
      ({ tag, attrs }) =>
        /^<meta\b/i.test(tag) && attrs.get("name")?.toLowerCase() === "description",
    );
  const canonicals = elements.filter((tag) => {
    const attrs = attributes(tag);
    return (
      /^<link\b/i.test(tag) && attrs.get("rel")?.toLowerCase().split(/\s+/).includes("canonical")
    );
  });
  const robots = elements
    .filter((tag) => /^<meta\b/i.test(tag))
    .map(attributes)
    .find((attrs) => attrs.get("name")?.toLowerCase() === "robots");
  const isNotFound = robots?.get("content")?.toLowerCase().includes("noindex") ?? false;
  if (isNotFound) noindexPages.add(file);

  if (!isNotFound) {
    if (titles.length !== 1 || !titles[0][1].trim())
      fail(file, `expected one non-empty title, found ${titles.length}`);
    if (descriptions.length !== 1 || !descriptions[0].attrs.get("content")?.trim())
      fail(file, `expected one non-empty meta description, found ${descriptions.length}`);
    if (canonicals.length !== 1)
      fail(file, `expected one canonical link, found ${canonicals.length}`);
    if (canonicals.length === 1) {
      const canonicalHref = decoded(attributes(canonicals[0]).get("href") ?? "");
      const canonicalUrl = new URL(canonicalHref, siteOrigin);
      const expectedPath = `/${path.relative(outputDirectory, file).replace(/index\.html$/, "")}`;
      if (
        !/^https:\/\//i.test(canonicalHref) ||
        canonicalUrl.origin !== siteOrigin ||
        canonicalUrl.pathname !== expectedPath ||
        canonicalUrl.search ||
        canonicalUrl.hash
      ) {
        fail(
          file,
          `canonical URL does not match this page without query or fragment: ${canonicalUrl.href}`,
        );
      }
    }
  } else if (canonicals.length > 0) {
    fail(file, "noindex page must not declare a canonical URL");
  }

  for (const tag of elements) {
    const attrs = attributes(tag);
    const id = attrs.get("id");
    if (id) {
      if (ids.has(id)) fail(file, `duplicate id "${id}"`);
      ids.add(id);
    }
    for (const [attribute, value] of attrs) {
      if (!["href", "src", "poster", "srcset"].includes(attribute) || !value) continue;
      if (attribute === "srcset") {
        for (const candidate of value.split(","))
          localAssetReferences.push({ file, value: candidate.trim().split(/\s+/)[0] });
      } else if (
        ["src", "poster"].includes(attribute) ||
        (attribute === "href" && attrs.has("download")) ||
        (attribute === "href" && /^<(?:link|use|image|source)\b/i.test(tag))
      ) {
        if (/^<link\b/i.test(tag) && attrs.get("rel")?.toLowerCase().includes("canonical"))
          continue;
        localAssetReferences.push({ file, value });
      } else {
        internalLinks.push({ file, value });
      }
    }
    const imageMetadata = `${attrs.get("property") ?? ""} ${attrs.get("name") ?? ""}`
      .toLowerCase()
      .split(/\s+/);
    if (
      /^<meta\b/i.test(tag) &&
      imageMetadata.some((name) => name === "og:image" || name === "twitter:image") &&
      attrs.has("content")
    ) {
      localAssetReferences.push({ file, value: attrs.get("content") });
    }
  }
  idsByFile.set(file, ids);
}

for (const { file, value } of internalLinks) {
  const href = decoded(value.trim());
  if (!href) continue;
  let url;
  try {
    url = new URL(href, pageBase(file));
  } catch {
    fail(file, `invalid link URL "${href}"`);
    continue;
  }
  if (url.origin !== siteOrigin) continue;
  const target = htmlFileForUrl(url);
  if (!target) {
    fail(file, `internal link has no built page: ${href}`);
    continue;
  }
  if (url.hash) {
    let fragment;
    try {
      fragment = decodeURIComponent(url.hash.slice(1));
    } catch {
      fail(file, `invalid fragment encoding in "${href}"`);
      continue;
    }
    if (!idsByFile.get(target)?.has(fragment))
      fail(
        file,
        `fragment target "${fragment}" does not exist in ${path.relative(outputDirectory, target)}`,
      );
  }
}

for (const { file, value } of localAssetReferences) {
  const reference = decoded(value.trim());
  if (!reference || reference.startsWith("#")) continue;
  const url = new URL(reference, pageBase(file));
  if (url.origin !== siteOrigin) continue;
  const assetPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const target = path.resolve(outputDirectory, assetPath);
  if (!target.startsWith(`${outputDirectory}${path.sep}`) || !allFiles.includes(target))
    fail(file, `local asset does not exist: ${reference}`);
}

for (const file of allFiles.filter((entry) => entry.endsWith(".css"))) {
  const css = await readFile(file, "utf8");
  for (const match of css.matchAll(/url\(([^)]*)\)/gi)) {
    const reference = match[1].trim().replace(/^['"]|['"]$/g, "");
    if (!reference || /^(?:data:|#)/i.test(reference)) continue;
    const url = new URL(reference, `${siteOrigin}/${path.relative(outputDirectory, file)}`);
    if (url.origin !== siteOrigin) continue;
    const target = path.resolve(
      outputDirectory,
      decodeURIComponent(url.pathname).replace(/^\/+/, ""),
    );
    if (!target.startsWith(`${outputDirectory}${path.sep}`) || !allFiles.includes(target))
      fail(file, `local CSS asset does not exist: ${reference}`);
  }
}

if (sitemapFiles.length === 0) {
  errors.push("no sitemap XML file found in build output");
} else {
  const pageUrls = new Set();
  const pendingSitemaps = [...sitemapFiles];
  const visitedSitemaps = new Set();
  while (pendingSitemaps.length) {
    const sitemapFile = pendingSitemaps.pop();
    if (visitedSitemaps.has(sitemapFile)) continue;
    visitedSitemaps.add(sitemapFile);
    const xml = await readFile(sitemapFile, "utf8");
    for (const [, rawUrl] of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      const url = new URL(decoded(rawUrl.trim()));
      if (url.origin !== siteOrigin) {
        fail(sitemapFile, `sitemap URL uses unexpected origin: ${url.href}`);
        continue;
      }
      if (url.pathname.endsWith(".xml")) {
        const childFile = path.resolve(
          outputDirectory,
          decodeURIComponent(url.pathname).replace(/^\/+/, ""),
        );
        if (!childFile.startsWith(`${outputDirectory}${path.sep}`) || !allFiles.includes(childFile))
          fail(sitemapFile, `nested sitemap does not exist: ${url.href}`);
        else pendingSitemaps.push(childFile);
        continue;
      }
      const target = htmlFileForUrl(url);
      if (!target) fail(sitemapFile, `sitemap URL has no built page: ${url.href}`);
      else if (noindexPages.has(target))
        fail(sitemapFile, `noindex page is included in sitemap: ${url.href}`);
      if (!url.pathname.endsWith("/"))
        fail(sitemapFile, `sitemap URL does not use trailing slash: ${url.href}`);
      pageUrls.add(url.href);
    }
  }
  for (const file of htmlFiles) {
    if (noindexPages.has(file)) continue;
    const canonicalTag = (htmlByFile.get(file).match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) ??
      [])[0];
    if (!canonicalTag) continue;
    const canonical = new URL(decoded(attributes(canonicalTag).get("href") ?? ""), siteOrigin);
    if (!pageUrls.has(canonical.href))
      fail(file, `canonical URL is missing from the sitemap: ${canonical.href}`);
  }
}

if (errors.length) {
  console.error(
    `Built output check failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`,
  );
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Built output check passed: ${htmlFiles.size} pages, ${sitemapFiles.length} sitemap file(s), local references and fragments resolved.`,
);
