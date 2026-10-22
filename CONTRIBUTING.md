# Contributing

Use Node.js 22+ and install locked dependencies with `npm ci`. Run `npm run format` after editing, then `npm run format:check`, `npm run build`, `npm run check` and `npm run package`. Use `npm run preview:light` and `npm run preview:dark` for an isolated VS Code preview on macOS/Linux; use F5 on Windows.

Edit `source/palette.json` and/or `scripts/build.mjs`; regenerate the theme JSON rather than editing generated files alone. Include generated theme changes with the source. Preserve the shared interface palette and use distinct syntax colors adapted to each editor background.

Review both themes across real code, selection, search, diagnostics, diff and terminal output. For Python semantic highlighting, install Python and Pylance in the preview profile. A passing contrast test does not establish every language's token coverage or overall usability.

Include the language, VS Code version, theme, relevant language extensions and reproduction sample with a bug report. For highlighting issues, inspect the token with **Developer: Inspect Editor Tokens and Scopes** before changing a mapping. Strip private paths and personal content from logs and screenshots.

The extension is declarative; do not introduce runtime extension code or runtime dependencies. Package only theme JSON, public documentation, license/brand notices and public assets. Read `docs/releasing.md` for release checks and `docs/screenshots.md` for screenshot guidance.

Formatting is enforced with pinned Prettier and `.editorconfig`. Generated theme JSON, the color-key reference and the dependency lock file are excluded from formatting; regenerate theme JSON with the build script. The explicit `package.json.files` list defines the VSIX contents.
