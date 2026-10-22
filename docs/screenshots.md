# README screenshots

Use real VS Code captures of the built extension. Do not substitute generated editor mockups or screenshots of an older palette.

## Minimum set

| File                                 | Content                                                           |
| ------------------------------------ | ----------------------------------------------------------------- |
| `assets/screenshots/agape-light.png` | agape Light, Explorer visible, TypeScript or Python sample open   |
| `assets/screenshots/agape-dark.png`  | agape Dark, identical code, layout, font size and scroll position |

Use a roughly 1600 × 1000 window, native-resolution PNG, 14–16 px editor text and a consistent built-in font. Capture only the editor window or crop to it. Keep code readable at README width. A side-by-side banner is optional; the two full-size images are the priority.

## Capture procedure

1. Build and install the final VSIX in the isolated profile with `npm run preview:light`.
2. Ensure the workspace is trusted and the language service has loaded. For Python, install Python and Pylance in this profile as described in the README. Use the synthetic `samples/studio.py` or `studio.ts`, not personal or client code.
3. Reload after installing a replacement VSIX. Confirm the active theme label and compare its colors with the generated JSON.
4. Show comments, declarations, types, strings, numbers, booleans and constants. Close sign-in notices, pop-ups and unrelated tabs. Hide account information, the OS menu bar, Dock, private filesystem paths and notifications.
5. Capture Light, select Dark from the theme picker, and capture the same frame after semantic highlighting settles.
6. Inspect both PNGs for readable text and private content. Add them to the README with descriptive alt text. Verify rendered images on GitHub and in the packaged Marketplace README.

A third detail image may show the terminal, Problems panel and a diff, but is optional.

## Included captures

Both PNGs are real VS Code Extension Development Host captures of `samples/studio.py`, using the generated theme files, Python/Pylance semantic highlighting and Menlo at 16 px. They use identical layout and scroll position. The 2880 × 1440 crops exclude the title bar, operating-system sharing indicator, account/status details and unused lower editor area. No syntax colors were edited. The README embeds both captures; they are included in the VSIX package. Public GitHub/Marketplace rendering will be verified after publication.
