# Repository instructions

This is a declarative VS Code theme extension. Keep engineering content in English. `README.md` describes product behavior, testing and scope; `source/palette.json` owns palette values and `scripts/build.mjs` owns VS Code role mappings. `themes/` contains generated distributable JSON.

- Node.js 22+, npm and the committed package lock define the local setup. Use `npm ci`, `npm run format:check`, `npm run build`, `npm run check`, and `npm run package`. `npm run preview:light` and `npm run preview:dark` open an isolated VS Code instance using ignored `.preview/` data and extensions.
- Do not alter normal editor settings or install into the user's normal extension directory without authorization. Keep changes in the repository and isolated preview by default.
- Preserve the core identity values. Syntax and ANSI changes need contrast checks and real-code review in both themes. Theme code has MIT terms; brand artwork has separate terms.
- The extension has no `main`, `browser`, activation events, telemetry, network calls or extension commands. Do not introduce runtime behavior for appearance changes.
- Preserve unrelated changes. Keep private planning notes, tracker mappings, local machine paths and private conversations out of public files, commit/PR text and releases. Public documentation must be self-contained. Review new/untracked files and package contents before publication.
- Generated VSIX packages and isolated preview data are ignored. Do not store publishing credentials. Commit, push and registry publication require explicit authorization.

- Public names: extension `agape Theme`, package `agape-theme`, labels `agape Light` and `agape Dark`. Review `docs/releasing.md` for distribution and `docs/screenshots.md` for real screenshot requirements. Preview scripts must preserve existing isolated settings and never modify the normal VS Code profile.

- Use the pinned formatter (`npm run format`) for source and docs. Generated theme JSON is intentionally excluded; regenerate it with `npm run build`. `package.json.files` is the package allowlist; do not reintroduce a second packaging filter. The isolated CLI preview helper supports macOS/Linux; Windows theme installation and F5 development are separate paths.
