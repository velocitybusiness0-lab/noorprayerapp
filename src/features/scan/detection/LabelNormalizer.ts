/** Normalizes detector labels for keyword matching. */
export function normalizeDetectorLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
}

/** True when a detector label matches a configured keyword. */
export function labelMatchesKeyword(keyword: string, label: string): boolean {
  const normalizedKeyword = normalizeDetectorLabel(keyword);
  const normalizedLabel = normalizeDetectorLabel(label);
  if (!normalizedKeyword || !normalizedLabel) return false;
  if (normalizedKeyword === normalizedLabel) return true;
  return (
    normalizedLabel.includes(normalizedKeyword) ||
    normalizedKeyword.includes(normalizedLabel)
  );
}
