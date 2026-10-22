import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
await mkdir(new URL('dist/', root), { recursive: true });
const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(new URL('node_modules/@vscode/vsce/vsce', root)),
    'package',
    '--out',
    fileURLToPath(new URL(`dist/${manifest.name}-${manifest.version}.vsix`, root)),
  ],
  { cwd: fileURLToPath(root), stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
if (result.status === 0) {
  const filename = `${manifest.name}-${manifest.version}.vsix`;
  const file = new URL(`dist/${filename}`, root);
  const checksum = createHash('sha256')
    .update(await readFile(file))
    .digest('hex');
  await writeFile(new URL(`dist/${filename}.sha256`, root), `${checksum}  ${filename}\n`);
}
