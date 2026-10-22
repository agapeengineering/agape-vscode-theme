import { readFile, writeFile, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const palette = JSON.parse(await readFile(new URL('source/palette.json', root), 'utf8'));

export function buildTheme(mode, p) {
  const colors = {};
  const set = (keys, color) =>
    keys.split(/\s+/).forEach((key) => {
      colors[key] = color;
    });
  const strong = mode === 'light' ? p['secondary-support'] : p.secondary;
  set(
    `foreground editor.foreground terminal.foreground sideBar.foreground
    activityBar.foreground titleBar.activeForeground tab.activeForeground
    panelTitle.activeForeground statusBar.foreground statusBar.noFolderForeground
    input.foreground dropdown.foreground menu.foreground quickInput.foreground
    editorWidget.foreground editorSuggestWidget.foreground editorHoverWidget.foreground
    notifications.foreground breadcrumb.foreground settings.headerForeground`,
    p.ink,
  );
  set('editor.background terminal.background tab.activeBackground', p['code-bg']);
  set(
    `sideBar.background activityBar.background titleBar.activeBackground
    titleBar.inactiveBackground editorGroupHeader.tabsBackground panel.background
    tab.inactiveBackground statusBar.background statusBar.noFolderBackground
    statusBar.debuggingBackground`,
    p.surface,
  );
  set(
    `editorWidget.background editorSuggestWidget.background editorHoverWidget.background
    menu.background quickInput.background dropdown.background input.background
    notifications.background notificationCenterHeader.background`,
    p.raised,
  );
  set(
    `descriptionForeground disabledForeground editorLineNumber.foreground
    editorCodeLens.foreground activityBar.inactiveForeground titleBar.inactiveForeground
    tab.inactiveForeground tab.unfocusedActiveForeground panelTitle.inactiveForeground
    breadcrumb.activeSelectionForeground notificationCenterHeader.foreground`,
    strong,
  );
  set('editorLineNumber.activeForeground', p.ink);
  set('focusBorder editorSuggestWidget.focusHighlightForeground', p.focus);
  set(
    `editorCursor.foreground activityBar.activeBorder tab.activeBorderTop
    panelTitle.activeBorder progressBar.background`,
    p.accent,
  );
  set(
    'textLink.foreground textLink.activeForeground editorSuggestWidget.highlightForeground',
    p.link,
  );
  set(
    `sideBar.border editorGroup.border editorGroupHeader.tabsBorder panel.border
    statusBar.border titleBar.border tab.border editorWidget.border
    editorHoverWidget.border editorSuggestWidget.border menu.border notifications.border`,
    p.border,
  );
  set(
    'input.border dropdown.border button.border checkbox.border radio.inactiveBorder',
    p['control-border'],
  );
  set(
    'editor.selectionBackground editor.inactiveSelectionBackground terminal.selectionBackground',
    p.selection,
  );
  set('editor.selectionForeground terminal.selectionForeground', p.ink);
  set(
    `list.activeSelectionBackground list.inactiveSelectionBackground
    editorSuggestWidget.selectedBackground`,
    p.active,
  );
  set(
    `list.activeSelectionForeground list.inactiveSelectionForeground
    editorSuggestWidget.selectedForeground list.focusForeground list.hoverForeground`,
    p.ink,
  );
  set('list.focusBackground', p['item-focus']);
  set(
    'list.focusOutline list.focusAndSelectionOutline list.activeSelectionIconForeground',
    p.focus,
  );
  set(
    'list.hoverBackground toolbar.hoverBackground button.secondaryHoverBackground',
    p['item-hover'],
  );
  set('editor.lineHighlightBackground', p['code-bg']);
  set('editor.lineHighlightBorder', p.border);
  set(
    `button.background badge.background activityBarBadge.background checkbox.background
    inputOption.activeBackground radio.activeBackground`,
    p.accent,
  );
  set(
    `button.foreground badge.foreground activityBarBadge.foreground checkbox.foreground
    inputOption.activeForeground radio.activeForeground`,
    p['button-ink'],
  );
  set('button.hoverBackground', p['action-hover']);
  set('button.secondaryBackground', p.raised);
  set('button.secondaryForeground', p.ink);
  set('input.placeholderForeground', strong);
  set('inputOption.activeBorder radio.activeBorder', p.focus);
  set('statusBar.debuggingForeground statusBarItem.remoteForeground', p.ink);
  set('statusBarItem.remoteBackground', p.raised);
  set('statusBarItem.hoverBackground', p['item-hover']);
  set('statusBarItem.errorBackground', p['error-bg']);
  set('statusBarItem.errorForeground', p.error);
  set('statusBarItem.warningBackground', p['warning-bg']);
  set('statusBarItem.warningForeground', p.warning);
  set(
    `editorError.foreground errorForeground gitDecoration.deletedResourceForeground
    editorGutter.deletedBackground minimap.errorHighlight
    notificationsErrorIcon.foreground`,
    p.error,
  );
  set(
    `editorWarning.foreground gitDecoration.modifiedResourceForeground
    editorGutter.modifiedBackground minimap.warningHighlight
    notificationsWarningIcon.foreground`,
    p.warning,
  );
  set('editorInfo.foreground notificationsInfoIcon.foreground', p.info);
  set(
    `gitDecoration.addedResourceForeground gitDecoration.untrackedResourceForeground
    editorGutter.addedBackground`,
    p.success,
  );
  set('gitDecoration.ignoredResourceForeground', strong);
  for (const [name, role] of [
    ['Error', 'error'],
    ['Warning', 'warning'],
    ['Info', 'info'],
  ]) {
    set(
      `inputValidation.${name.toLowerCase()}Foreground inputValidation.${name.toLowerCase()}Border`,
      p[role],
    );
    set(`inputValidation.${name.toLowerCase()}Background`, p[`${role}-bg`]);
  }
  set('editor.findMatchBackground', p.selection);
  set('editor.findMatchForeground', p.ink);
  set('editor.findMatchBorder', p.link);
  set('editor.findMatchHighlightBackground editor.rangeHighlightBackground', p.active + '88');
  set('editor.findMatchHighlightBorder', p['control-border']);
  set('editor.wordHighlightBackground editor.wordHighlightStrongBackground', p.active + '88');
  set('editor.wordHighlightBorder editor.wordHighlightStrongBorder', p['control-border']);
  set('diffEditor.insertedTextBackground', p.success + (mode === 'dark' ? '0E' : '12'));
  set('diffEditor.removedTextBackground', p.error + (mode === 'dark' ? '0E' : '12'));
  set('diffEditor.insertedLineBackground', p.success + '08');
  set('diffEditor.removedLineBackground', p.error + '08');
  set('diffEditor.insertedTextBorder', p.success);
  set('diffEditor.removedTextBorder', p.error);
  set('editorIndentGuide.background1', p.border + '88');
  set('editorIndentGuide.activeBackground1', p['control-border']);
  set('editorWhitespace.foreground', p['control-border'] + '99');
  set('scrollbarSlider.background', strong + '50');
  set('scrollbarSlider.hoverBackground', strong + '80');
  set('scrollbarSlider.activeBackground', strong + 'A0');
  set('textCodeBlock.background textPreformat.background', p.surface);
  set('textPreformat.foreground', p.ink);
  set('textBlockQuote.background', p.raised);
  set('textBlockQuote.border', p.accent);
  set('textSeparator.foreground', p.border);
  set('peekViewEditor.background', p['code-bg']);
  set('peekViewResult.background peekViewTitle.background', p.raised);
  set(
    'peekViewResult.fileForeground peekViewResult.lineForeground peekViewTitleLabel.foreground',
    p.ink,
  );
  set('peekView.border', p.focus);
  set('peekViewResult.selectionBackground', p.active);
  set('peekViewResult.selectionForeground', p.ink);
  set('merge.currentHeaderBackground', p.success + '30');
  set('merge.currentContentBackground', p.success + '12');
  set('merge.incomingHeaderBackground', p.info + '30');
  set('merge.incomingContentBackground', p.info + '12');
  set('debugIcon.breakpointForeground', p.error);
  set('debugIcon.startForeground', p.success);
  set('debugToolBar.background', p.raised);
  set('editor.stackFrameHighlightBackground', p.warning + '20');
  set('editor.focusedStackFrameHighlightBackground', p.success + '20');
  const syntax = p.syntax;
  (
    p.brackets ??
    ['function', 'type', 'keyword', 'string', 'number', 'variable'].map((role) => syntax[role])
  ).forEach((color, index) => set(`editorBracketHighlight.foreground${index + 1}`, color));
  const ansiNames = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'];
  p.ansi.forEach((color, index) =>
    set(`terminal.ansi${index < 8 ? '' : 'Bright'}${ansiNames[index % 8]}`, color),
  );
  set('terminalCursor.foreground', p.accent);
  set('terminalCursor.background', p['code-bg']);
  const rules = [
    ['Comments', 'comment punctuation.definition.comment', 'comment'],
    ['Keywords', 'keyword storage.type storage.modifier', 'keyword'],
    ['Control flow', 'keyword.control', 'control'],
    ['Strings', 'string constant.other.symbol markup.inline.raw', 'string'],
    ['Functions', 'entity.name.function support.function', 'function'],
    ['Types', 'entity.name.type entity.name.class support.type support.class', 'type'],
    ['Numbers', 'constant.numeric constant.character', 'number'],
    ['Language constants and booleans', 'constant.language', 'boolean'],
    ['Constants and enum members', 'variable.other.constant variable.other.enummember', 'constant'],
    ['Variables', 'variable meta.object-literal.key', 'variable'],
    ['Tags', 'entity.name.tag', 'keyword'],
    ['Attributes', 'entity.other.attribute-name', 'function'],
    ['Punctuation and operators', 'punctuation keyword.operator', 'punctuation'],
    ['Headings', 'markup.heading entity.name.section', 'function'],
    ['Links', 'markup.underline.link', 'type'],
    ['Invalid syntax', 'invalid', 'invalid'],
  ];
  const tokenColors = rules.map(([name, scope, role]) => ({
    name,
    scope: scope.split(' '),
    settings: { foreground: syntax[role] ?? syntax.number },
  }));
  tokenColors.push(
    { name: 'Emphasis', scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { name: 'Italic emphasis', scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
    { name: 'Inserted content', scope: ['markup.inserted'], settings: { foreground: p.success } },
    { name: 'Deleted content', scope: ['markup.deleted'], settings: { foreground: p.error } },
  );
  const semanticTokenColors = {};
  for (const [role, names] of Object.entries({
    type: 'namespace type class enum interface struct typeParameter',
    variable: 'parameter variable property',
    number: 'number',
    boolean: 'boolean',
    constant: 'enumMember',
    function: 'function method decorator',
    keyword: 'keyword modifier',
    comment: 'comment',
    string: 'string regexp',
    punctuation: 'operator',
  })) {
    for (const name of names.split(' ')) semanticTokenColors[name] = syntax[role] ?? syntax.number;
  }
  semanticTokenColors['*.readonly'] = { foreground: syntax.constant ?? syntax.number };
  semanticTokenColors['*.deprecated'] = { strikethrough: true };
  return {
    $schema: 'vscode://schemas/color-theme',
    name: `agape ${mode === 'light' ? 'Light' : 'Dark'}`,
    type: mode,
    semanticHighlighting: true,
    colors,
    tokenColors,
    semanticTokenColors,
  };
}

await mkdir(new URL('themes/', root), { recursive: true });
for (const [mode, p] of Object.entries(palette.themes)) {
  await writeFile(
    new URL(`themes/agape-${mode}.json`, root),
    JSON.stringify(buildTheme(mode, p), null, 2) + '\n',
  );
}
console.log('Built agape Light and agape Dark.');
