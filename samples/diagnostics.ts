// Deliberate diagnostics. This file is a visual fixture, not production code.
const progress: number = 'almost finished';
const project = { name: 'A useful idea' };
console.log(project.missingProperty);

/** @deprecated Use the current appearance settings instead. */
function legacyAppearance() {
  return 'old';
}
legacyAppearance();
export { progress };
