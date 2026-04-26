// Flat config for ESLint v9+
// Keeps this repo lint-able without adding eslint to package.json.

const nodeGlobals = {
  process: "readonly",
  console: "readonly",
  Buffer: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  global: "readonly",
  module: "readonly",
  require: "readonly",
  exports: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  setImmediate: "readonly",
  clearImmediate: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  fetch: "readonly",
};

const browserGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  location: "readonly",
  history: "readonly",
  console: "readonly",
  fetch: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  FormData: "readonly",
  Headers: "readonly",
  Request: "readonly",
  Response: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  performance: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  alert: "readonly",
  confirm: "readonly",
  prompt: "readonly",
  Event: "readonly",
  CustomEvent: "readonly",
  HTMLElement: "readonly",
  Image: "readonly",
  IntersectionObserver: "readonly",
  MutationObserver: "readonly",
  ResizeObserver: "readonly",
  // Project-specific helper defined in public/js/main.js, used across pages
  escapeHTML: "readonly",
};

const sharedRules = {
  "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  "no-undef": "error",
  "no-console": "off",
  eqeqeq: ["error", "always"],
  "prefer-const": "warn",
};

export default [
  {
    ignores: ["node_modules/**", "package-lock.json"],
  },
  // Browser-side scripts
  {
    files: ["public/**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: browserGlobals,
    },
    rules: sharedRules,
  },
  // Server-side / tooling scripts (everything else)
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["public/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: nodeGlobals,
    },
    rules: sharedRules,
  },
];
