export function normalizeTargets(input: string): string[] {
  return input
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
