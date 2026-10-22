# Release and distribution

## Identity and current status

| Item                           | Value                                 |
| ------------------------------ | ------------------------------------- |
| Repository name                | `agape-vscode-theme`                  |
| GitHub home                    | `agapeengineering/agape-vscode-theme` |
| Extension display name         | agape Theme                           |
| Extension package name         | `agape-theme`                         |
| Intended publisher / namespace | `agapeengineering`                    |
| Intended extension ID          | `agapeengineering.agape-theme`        |
| Theme picker labels            | agape Light; agape Dark               |
| Initial candidate              | 0.1.0                                 |

The public source repository is `agapeengineering/agape-vscode-theme`. Marketplace and Open VSX listings are not live yet; confirm publisher and namespace ownership before registry publication. Keep the same extension name and publisher/namespace across registries. Register the final identity before the first public release; changing it later creates a separate extension.

## Prepare the first release

1. Review the two included VS Code screenshots described in `screenshots.md`. Refresh them if the palette or code samples change; ensure README images match the final packaged themes.
2. Verify the repository, homepage and issue URLs in `package.json`, and push the reviewed source to the public GitHub repository. `vsce` resolves README links against that repository.
3. Review the entire public tree, including untracked starter files, licenses, sample code and images. Exclude local paths, personal screenshots, preview data and credentials. Verify any history that will be pushed.
4. Confirm publisher ownership on both registries. Keep credentials outside the repository and logs.
5. Choose the release version. Use 0.1.0 for the first public preview; use 1.0.0 when the stable release is approved. Update `package.json` and the lock file together, then update the changelog and README version examples. The packaging script derives its filename from the manifest.
6. Run the checks below on the exact source to release, test a fresh VSIX installation, then create a GitHub tag/release and attach the VSIX and its SHA-256 checksum.
7. Publish the same tested VSIX to Marketplace and Open VSX. Verify labels, icon, screenshots, install behavior and version on both listings. Add real listing links to the README only after they exist.

## Validate

```sh
npm ci
npm run package
```

`npm run package` includes formatting, generation, theme checks and preview-launcher regression checks. Its explicit file list limits VSIX contents.

Generated themes must have no uncommitted drift after `npm run build`. Review archive contents: theme JSON, public README/changelog, license/brand notice and public assets only. Development scripts, dependencies, samples, preview profiles and credentials do not belong in the extension package.

Review both themes in Python with Python/Pylance and in TypeScript using built-in language support. Check selections, search, focus, hover, disabled controls, Problems, diff, terminal and user/system theme switching. Passing numeric checks complements visual review.

## Distribution channels

### GitHub

Publish source under the MIT code license with the separate brand notice. Attach the tested `.vsix` to a tagged GitHub release so people can use **Extensions: Install from VSIX…** without a registry account. Include a SHA-256 checksum and concise release notes. GitHub hosting does not automatically create editor-store listings.

### Visual Studio Marketplace

Create a Marketplace publisher and confirm that `package.json.publisher` matches it. Microsoft documents both packaging and publishing, including secure automated publishing with Microsoft Entra workload identity federation. Prefer that approach for ongoing automation; global Azure DevOps PATs retire on December 1, 2026. Do not embed a credential in a script or command example.

Use the publisher portal to upload the tested VSIX, or configure a publishing job only after publisher authentication is established. Keep validation CI separate from publication. The current CI never publishes.

Official guide: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

### Open VSX

Open VSX is a separate registry. Its publishing process requires an Eclipse account, GitHub login, acceptance of the Publisher Agreement, namespace setup and publishing authentication. The namespace should match the Marketplace publisher. If the extension already exists on Marketplace, establish corresponding Open VSX namespace ownership before publishing.

Upload the same VSIX using the official `ovsx` CLI after authentication is configured. An Open VSX listing makes the package available to editors that use that registry; individual editor compatibility still needs testing.

Official guide: https://github.com/EclipseFdn/open-vsx.org/wiki/Publishing-Extensions

## Maintenance

Use semantic versioning for releases: fixes for corrected mappings, minor releases for additive support, major releases for breaking changes. Review appearance changes with screenshots and release notes. Do not rebuild a tagged version differently; publish a new version for corrections. Keep Marketplace and Open VSX versions synchronized.
