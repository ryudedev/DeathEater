module.exports = {
    // Type check TypeScript files
    '(apps|packages)/**/*.(ts|tsx|js)': () => ['pnpm type-check','pnpm format', 'pnpm lint']
};
