import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
if (process.platform === 'win32') {
  throw new Error(
    'The isolated preview helper supports macOS and Linux. On Windows, use F5 or install the VSIX in a separate VS Code profile.',
  );
}
const options = new Set(process.argv.slice(2));
if (
  [...options].some((option) => !['--light', '--dark', '--install-only'].includes(option)) ||
  (options.has('--light') && options.has('--dark'))
) {
  throw new Error('Use --light or --dark, optionally with --install-only.');
}
const root = new URL('../', import.meta.url);
const local = (path) => fileURLToPath(new URL(path, root));
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const vsix = local(`dist/${manifest.name}-${manifest.version}.vsix`);
await access(vsix);
await mkdir(local('.preview/user-data/User'), { recursive: true });
await mkdir(local('.preview/extensions'), { recursive: true });
let previous = {};
try {
  previous = JSON.parse(await readFile(local('.preview/user-data/User/settings.json'), 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const settings = {
  'workbench.colorTheme': 'agape Dark',
  'workbench.preferredLightColorTheme': 'agape Light',
  'workbench.preferredDarkColorTheme': 'agape Dark',
  'window.autoDetectColorScheme': false,
  'telemetry.telemetryLevel': 'off',
  'extensions.autoCheckUpdates': false,
  'extensions.autoUpdate': false,
  'update.mode': 'none',
  'workbench.startupEditor': 'none',
  'editor.semanticHighlighting.enabled': true,
  'editor.minimap.enabled': false,
  ...previous,
};
for (const key of [
  'workbench.colorTheme',
  'workbench.preferredLightColorTheme',
  'workbench.preferredDarkColorTheme',
]) {
  if (/^(Cinnamon & Adobe|agape engineering) (Light|Dark)$/i.test(settings[key] ?? '')) {
    settings[key] = /light$/i.test(settings[key]) ? 'agape Light' : 'agape Dark';
  }
}
if (process.argv.includes('--light')) settings['workbench.colorTheme'] = 'agape Light';
if (process.argv.includes('--dark')) settings['workbench.colorTheme'] = 'agape Dark';
await writeFile(
  local('.preview/user-data/User/settings.json'),
  JSON.stringify(settings, null, 2) + '\n',
);
const args = [
  '--user-data-dir',
  local('.preview/user-data'),
  '--extensions-dir',
  local('.preview/extensions'),
];
const run = (extra) => {
  const result = spawnSync('code', [...args, ...extra], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};
run(['--install-extension', vsix, '--force']);
if (!process.argv.includes('--install-only'))
  run(['--new-window', local('samples'), local('samples/studio.ts'), local('samples/studio.py')]);
console.log(
  'Isolated preview ready. Select agape Light or agape Dark in Preferences: Color Theme.',
);
