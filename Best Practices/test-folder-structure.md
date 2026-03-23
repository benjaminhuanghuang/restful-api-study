# Folder structure for test

Keep production code in src/ only.

Put broader tests in a separate top-level tests/ folder (integration/e2e).

Optionally keep small unit tests co-located next to files in src/ (e.g., \*.test.ts) if your team likes proximity.

## tsconfig

```json
"include": ["src/**/*.ts"],
"exclude": ["tests", "node_modules", "dist"]
```

compile only TypeScript files under src

exclude: ["tests"] only affects what tsc compiles for your build, not what Vitest executes.
