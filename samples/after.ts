export function describe(name: string, progress = 0.75) {
  const percent = Math.round(progress * 100);
  return `${name}: ${percent}% complete`;
}
