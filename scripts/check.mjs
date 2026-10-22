import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const json = async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const manifest = await json('package.json');
const palette = await json('source/palette.json');
const reference = await json('source/vscode-color-keys.json');
const known = new Set(reference.keys);
let checks = 0;
const failures = [];
const check = (condition, message) => {
  checks++;
  if (!condition) failures.push(message);
};
export function luminance(color) {
  const values = [1, 3, 5]
    .map((i) => parseInt(color.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return values.reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
const ratio = (a, b) => {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
};
const blend = (foreground, background) => {
  if (foreground.length === 7) return foreground;
  const alpha = parseInt(foreground.slice(7, 9), 16) / 255;
  return (
    '#' +
    [1, 3, 5]
      .map((i) =>
        Math.round(
          parseInt(foreground.slice(i, i + 2), 16) * alpha +
            parseInt(background.slice(i, i + 2), 16) * (1 - alpha),
        )
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
};
const text = (fg, bg, label) =>
  check(ratio(fg, bg) >= 4.5, `${label}: ${ratio(fg, bg).toFixed(3)}:1 below 4.5:1 (${fg}/${bg})`);
check(manifest.contributes.themes.length === 2, 'Two themes must be contributed');
check(
  !manifest.main && !manifest.browser && !manifest.activationEvents,
  'Color themes have no executable extension entry point',
);
for (const contribution of manifest.contributes.themes) {
  const theme = await json(contribution.path);
  const c = theme.colors;
  const p = palette.themes[theme.type];
  check(theme.name === contribution.label, 'Theme label matches manifest');
  check(theme.semanticHighlighting === true, 'Semantic highlighting is enabled');
  check(
    (theme.type === 'dark' ? 'vs-dark' : 'vs') === contribution.uiTheme,
    'Correct base appearance',
  );
  for (const [key, value] of Object.entries(c)) {
    check(/^#[\da-f]{6}([\da-f]{2})?$/i.test(value), 'Valid color: ' + key);
    check(known.has(key), 'Documented VS Code color key: ' + key);
  }
  const syntaxText = text;
  for (const [key, value] of Object.entries(p.syntax))
    syntaxText(value, c['editor.background'], theme.type + ' syntax ' + key);
  for (const rule of theme.tokenColors) {
    if (rule.settings.foreground)
      syntaxText(rule.settings.foreground, c['editor.background'], theme.type + ' ' + rule.name);
  }
  for (const [key, value] of Object.entries(theme.semanticTokenColors)) {
    const foreground = typeof value === 'string' ? value : value.foreground;
    if (foreground) syntaxText(foreground, c['editor.background'], theme.type + ' semantic ' + key);
  }
  // Distinct numeric, boolean and readonly/enum roles must survive both token systems.
  const tokenFor = (scope) =>
    theme.tokenColors.find((rule) => rule.scope.includes(scope))?.settings.foreground;
  check(tokenFor('constant.numeric') === p.syntax.number, theme.type + ' numeric token mapping');
  check(
    tokenFor('constant.language') === (p.syntax.boolean ?? p.syntax.number),
    theme.type + ' boolean token mapping',
  );
  check(
    tokenFor('variable.other.constant') === (p.syntax.constant ?? p.syntax.number),
    theme.type + ' constant token mapping',
  );
  check(
    theme.semanticTokenColors.boolean === (p.syntax.boolean ?? p.syntax.number),
    theme.type + ' semantic boolean mapping',
  );
  check(
    theme.semanticTokenColors.enumMember === (p.syntax.constant ?? p.syntax.number),
    theme.type + ' semantic enum mapping',
  );
  check(
    theme.semanticTokenColors['*.readonly'].foreground === (p.syntax.constant ?? p.syntax.number),
    theme.type + ' semantic readonly mapping',
  );
  const pairs = [
    ['foreground', 'sideBar.background'],
    ['sideBar.foreground', 'sideBar.background'],
    ['input.foreground', 'input.background'],
    ['input.placeholderForeground', 'input.background'],
    ['descriptionForeground', 'sideBar.background'],
    ['button.foreground', 'button.background'],
    ['button.foreground', 'button.hoverBackground'],
    ['button.secondaryForeground', 'button.secondaryBackground'],
    ['button.secondaryForeground', 'button.secondaryHoverBackground'],
    ['list.activeSelectionForeground', 'list.activeSelectionBackground'],
    ['list.focusForeground', 'list.focusBackground'],
    ['list.hoverForeground', 'list.hoverBackground'],
    ['editor.selectionForeground', 'editor.selectionBackground'],
    ['editor.findMatchForeground', 'editor.findMatchBackground'],
    ['textLink.foreground', 'sideBar.background'],
    ['statusBar.foreground', 'statusBar.background'],
    ['editorSuggestWidget.foreground', 'editorSuggestWidget.background'],
    ['editorSuggestWidget.selectedForeground', 'editorSuggestWidget.selectedBackground'],
    ['notifications.foreground', 'notifications.background'],
    ['inputValidation.errorForeground', 'inputValidation.errorBackground'],
    ['inputValidation.warningForeground', 'inputValidation.warningBackground'],
    ['inputValidation.infoForeground', 'inputValidation.infoBackground'],
  ];
  for (const [fg, bg] of pairs) text(c[fg], c[bg], theme.type + ' ' + fg);
  for (const color of p.ansi) text(color, c['terminal.background'], theme.type + ' ANSI ' + color);
  check(new Set(p.ansi).size >= 15, 'ANSI normal/bright colors are individually defined');
  for (const bg of [
    'editor.background',
    'sideBar.background',
    'input.background',
    'list.focusBackground',
  ])
    check(ratio(c.focusBorder, c[bg]) >= 3, theme.type + ' focus against ' + bg);
  // Search and diff tints retain syntax legibility when token colors are preserved.
  for (const background of [
    'editor.findMatchHighlightBackground',
    'diffEditor.insertedTextBackground',
    'diffEditor.removedTextBackground',
  ]) {
    const composite = blend(c[background], c['editor.background']);
    for (const [name, value] of Object.entries(p.syntax))
      syntaxText(value, composite, theme.type + ' ' + name + ' over ' + background);
  }
  for (const kind of ['inserted', 'removed']) {
    const line = blend(c[`diffEditor.${kind}LineBackground`], c['editor.background']);
    const composite = blend(c[`diffEditor.${kind}TextBackground`], line);
    for (const [name, value] of Object.entries(p.syntax))
      syntaxText(
        value,
        composite,
        theme.type + ' ' + name + ' over stacked ' + kind + ' diff highlights',
      );
  }
  // Keep the approved UI foundation exact, independently of syntax decisions.
  check(
    c['sideBar.background'] === p.surface &&
      c['button.background'] === p.accent &&
      c['editor.foreground'] === p.ink,
    theme.type + ' core roles',
  );
  console.log(
    `${theme.name}: ${Object.keys(c).length} UI colors; syntax, ANSI, selected text, focus and UI contrast checked.`,
  );
}
assert.deepEqual(failures, [], failures.join('\n'));
console.log(`PASS: ${checks} structural, mapping and enforced contrast checks.`);
