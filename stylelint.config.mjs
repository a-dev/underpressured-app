/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-clean-order/error"],
  ignoreFiles: ["dist/**", ".astro/**", ".agents/**"],
  rules: {
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes"],
      },
    ],
    // Without `in <space>`, `color-mix()` uses oklab and goes off the oklch palette.
    "declaration-property-value-disallowed-list": [
      { "/.*/": [/color-mix\((?!\s*in[\s(])/] },
      {
        message:
          "Expected color-mix() to state a colour-interpolation method, e.g. color-mix(in oklch, ...)",
      },
    ],
    "custom-property-pattern": [
      "^_?([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message: (name) =>
          `Expected custom property name "${name}" to be kebab-case, optionally prefixed with "_" for private component properties`,
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.astro"],
      customSyntax: "postcss-html",
    },
  ],
};
