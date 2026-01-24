/**
 * ESLint config for declarative-ui pattern
 *
 * Copy this to your project's .eslintrc.cjs and adjust paths as needed.
 *
 * This rule prevents pages from importing Svelte components directly,
 * enforcing the "pages are data" principle.
 */
module.exports = {
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            // Block importing .svelte files in page definitions
            group: ["**/ui/atoms/**/*.svelte", "**/ui/molecules/**/*.svelte", "**/ui/organisms/**/*.svelte"],
            message: "Pages should be data only. Use { atom: 'button' } instead of importing components directly."
          }
        ]
      }
    ]
  },
  overrides: [
    {
      // Only apply to page files
      files: ["src/pages/**/*.ts"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/*.svelte"],
                message: "Page files must be pure data. Do not import Svelte components."
              }
            ]
          }
        ]
      }
    }
  ]
};
