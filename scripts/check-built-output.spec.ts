import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const directories: string[] = [];

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true })));
});

async function checkOutput({
  body = '<a href="#target">Target</a><h1 id="target">Home</h1>',
  head = '<link rel="canonical" href="https://underpressured.app/">',
  sitemap = "https://underpressured.app/",
}: { body?: string; head?: string; sitemap?: string } = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), "underpressured-output-"));
  directories.push(directory);
  await Promise.all([
    writeFile(
      path.join(directory, "index.html"),
      `<html><head><title>Home</title><meta name="description" content="Description">${head}</head><body>${body}</body></html>`,
    ),
    writeFile(
      path.join(directory, "sitemap.xml"),
      `<urlset><url><loc>${sitemap}</loc></url></urlset>`,
    ),
  ]);
  return spawnSync(process.execPath, ["scripts/check-built-output.mjs", directory], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

describe("built output validator", () => {
  it("accepts a page with matching metadata, sitemap, and fragment", async () => {
    const result = await checkOutput();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Built output check passed");
  });

  it.each([
    ["missing page", '<a href="/missing/">Missing</a>', "internal link has no built page"],
    ["missing fragment", '<a href="#missing">Missing</a>', 'fragment target "missing"'],
    ["duplicate id", '<h1 id="same">One</h1><p id="same">Two</p>', 'duplicate id "same"'],
    ["missing image", '<img src="/missing.png">', "local asset does not exist"],
    ["missing poster", '<video poster="/missing.png"></video>', "local asset does not exist"],
    ["missing srcset image", '<img srcset="/missing.png 1x">', "local asset does not exist"],
  ])("rejects %s", async (_name, body, message) => {
    const result = await checkOutput({ body });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(message);
  });

  it("allows external links and assets", async () => {
    const result = await checkOutput({
      body: '<a href="https://example.test/page">External</a><img src="https://example.test/image.png">',
    });
    expect(result.status).toBe(0);
  });

  it.each([
    ["missing canonical", "", "expected one canonical link"],
    [
      "wrong canonical origin",
      '<link rel="canonical" href="https://example.test/">',
      "canonical URL does not match",
    ],
    [
      "canonical query",
      '<link rel="canonical" href="https://underpressured.app/?query=1">',
      "canonical URL does not match",
    ],
    [
      "noindex page with canonical",
      '<meta name="robots" content="noindex"><link rel="canonical" href="https://underpressured.app/">',
      "noindex page must not declare a canonical URL",
    ],
  ])("rejects %s", async (_name, head, message) => {
    const result = await checkOutput({ head });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(message);
  });

  it("rejects a sitemap that omits an indexable page", async () => {
    const result = await checkOutput({ sitemap: "https://underpressured.app/missing/" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("canonical URL is missing from the sitemap");
  });
});
