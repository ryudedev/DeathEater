module.exports = {
    // Lint then format TypeScript and JavaScript files
    '(web|api)/**/*.(ts|tsx|js)': filenames => [
      `pnpm fmt:precommit`,
      `pnpm lint:precommit`,
    ],
  };
