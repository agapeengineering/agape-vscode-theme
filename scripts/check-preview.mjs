import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, copyFile, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, delimiter } from 'node:path';
import { spawnSync } from 'node:child_process';
if (process.platform === 'win32') {
  console.log('Preview launcher fixture uses a POSIX CLI stub; run on macOS or Linux.');
  process.exit(0);
}
const fixture = await mkdtemp(join(tmpdir(), 'agape-preview-test-'));
try {
  await mkdir(join(fixture, 'scripts'));
  await mkdir(join(fixture, 'dist'));
  await mkdir(join(fixture, 'bin'));
  await mkdir(join(fixture, '.preview/user-data/User'), { recursive: true });
  await copyFile(new URL('./preview.mjs', import.meta.url), join(fixture, 'scripts/preview.mjs'));
  await writeFile(
    join(fixture, 'package.json'),
    JSON.stringify({ name: 'agape-theme', version: '0.1.0' }),
  );
  await writeFile(join(fixture, 'dist/agape-theme-0.1.0.vsix'), 'CLI fixture');
  await writeFile(join(fixture, 'bin/code'), '#!/bin/sh\nexit 0\n');
  await chmod(join(fixture, 'bin/code'), 0o755);
  const settingsPath = join(fixture, '.preview/user-data/User/settings.json');
  await writeFile(
    settingsPath,
    JSON.stringify({
      'workbench.colorTheme': 'agape engineering light',
      'workbench.preferredLightColorTheme': 'Cinnamon & Adobe Light',
      'editor.fontSize': 17,
    }),
  );
  const run = (args) =>
    spawnSync(process.execPath, [join(fixture, 'scripts/preview.mjs'), ...args], {
      cwd: tmpdir(),
      env: { ...process.env, PATH: join(fixture, 'bin') + delimiter + process.env.PATH },
      encoding: 'utf8',
    });
  let result = run(['--install-only']);
  assert.equal(result.status, 0, result.stderr);
  let settings = JSON.parse(await readFile(settingsPath, 'utf8'));
  assert.equal(settings['workbench.colorTheme'], 'agape Light');
  assert.equal(settings['workbench.preferredLightColorTheme'], 'agape Light');
  assert.equal(settings['editor.fontSize'], 17);
  result = run(['--install-only', '--dark']);
  assert.equal(result.status, 0, result.stderr);
  settings = JSON.parse(await readFile(settingsPath, 'utf8'));
  assert.equal(settings['workbench.colorTheme'], 'agape Dark');
  assert.equal(settings['editor.fontSize'], 17);
  await writeFile(settingsPath, '{broken');
  result = run(['--install-only']);
  assert.notEqual(result.status, 0);
  assert.equal(await readFile(settingsPath, 'utf8'), '{broken');
  await writeFile(settingsPath, JSON.stringify(settings));
  await writeFile(join(fixture, 'bin/code'), '#!/bin/sh\nkill -TERM $$\n');
  result = run(['--install-only']);
  assert.notEqual(result.status, 0, 'A terminated VS Code CLI must not count as success');
  const saved = await readFile(settingsPath, 'utf8');
  result = run(['--light', '--dark']);
  assert.notEqual(result.status, 0, 'Contradictory mode flags must fail');
  assert.equal(await readFile(settingsPath, 'utf8'), saved);
  console.log(
    'PASS: preview preserves settings, migrates labels, selects explicit modes, resolves paths independently of cwd, preserves malformed settings, and rejects terminated CLI processes and contradictory options.',
  );
} finally {
  await rm(fixture, { recursive: true, force: true });
}
