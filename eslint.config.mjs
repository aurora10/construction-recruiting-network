import nextCoreWebVitals from "eslint-config-next/core-web-vitals"

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextCoreWebVitals,
  {
    rules: {
      // Content pages contain natural-language apostrophes; escaping them all is noise.
      "react/no-unescaped-entities": "off",
      // We intentionally use standard <img> because next.config.mjs sets images.unoptimized.
      "@next/next/no-img-element": "off",
    },
  },
]

export default config
