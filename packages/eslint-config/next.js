const { resolve } = require("node:path");
const path = require('path');

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [path.resolve(__dirname, './base.js'), require.resolve("@vercel/style-guide/eslint/next")],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["only-warn"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
