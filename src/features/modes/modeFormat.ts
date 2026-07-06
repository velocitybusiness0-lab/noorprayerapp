import { ALL_SALAH_MODES, SALAH_MODE_LABELS, SalahMode } from "./mode.types";

/** Compact label for the home-screen mode pill. */
export function formatEnabledModesSummary(modes: SalahMode[]): string {
  const ordered = ALL_SALAH_MODES.filter((mode) => modes.includes(mode));
  if (ordered.length === 0) return SALAH_MODE_LABELS.reminder;
  if (ordered.length === ALL_SALAH_MODES.length) return "All modes";
  return ordered.map((mode) => SALAH_MODE_LABELS[mode]).join(" + ");
}

/** True when alarm or block is active (needs scan / pre-disarm flows). */
export function hasActiveSalahAction(modes: SalahMode[]): boolean {
  return modes.includes("alarm") || modes.includes("block");
}
