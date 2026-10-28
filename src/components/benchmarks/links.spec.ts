import { describe, expect, it } from "vitest";

import { caveats, intro, sections, setup, stats, tools, type Table } from "./content";
import { libraries, linkify } from "./links";

const cells = (table: Table) => [table.caption, ...table.rows.flatMap((row) => row.slice(1))];

// Every string the page renders through Text, in page order.
const texts = [
  intro,
  ...stats.map((stat) => stat.label),
  ...setup.map((item) => item.text),
  ...sections.flatMap((section) => [
    section.lead,
    section.verdict,
    ...(section.chart ? [section.chart.title, section.chart.note] : []),
    ...cells(section.table),
    ...section.notes,
  ]),
  ...cells(tools),
  ...caveats,
];

const mentions = (text: string, name: string) =>
  new RegExp(`(^|[^\\w[])${name}(?![\\w\\]])`).test(text);

describe("library links", () => {
  it("knows every marked name", () => {
    for (const text of texts) expect(() => linkify(text)).not.toThrow();
  });

  it.each(Object.keys(libraries))("links %s exactly once, at its first mention", (name) => {
    const linked = texts.filter((text) => text.includes(`[${name}]`));
    expect(linked).toHaveLength(1);

    const first = texts.find((text) => text.includes(`[${name}]`) || mentions(text, name));
    expect(first).toContain(`[${name}]`);
  });
});
