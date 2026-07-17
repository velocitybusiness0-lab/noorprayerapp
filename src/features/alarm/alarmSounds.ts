/**
 * Registry of selectable alarm sounds.
 *
 * `fileName` refers to an audio file bundled in the app (AlarmKit reads the
 * sound from the main bundle or Library/Sounds by name). Drop the matching
 * files into `assets/sounds/` and register them here. `undefined` uses the
 * default system alarm sound.
 *
 * See `assets/sounds/README.md` for royalty-free sources.
 */
export interface AlarmSound {
  id: string;
  label: string;
  /** Bundled file name incl. extension, or undefined for the system sound. */
  fileName?: string;
}

export const ALARM_SOUNDS: AlarmSound[] = [
  { id: "system", label: "System default" },
  { id: "adhan_makkah", label: "Adhan (Makkah)", fileName: "adhan_makkah.caf" },
  { id: "adhan_madinah", label: "Adhan (Madinah)", fileName: "adhan_madinah.caf" },
  { id: "takbir", label: "Takbir", fileName: "takbir.caf" },
  { id: "soft_chime", label: "Soft chime", fileName: "soft_chime.caf" },
  { id: "gentle_bells", label: "Gentle bells", fileName: "gentle_bells.caf" },
];

export const DEFAULT_ALARM_SOUND_ID = "system";

export function soundById(id: string): AlarmSound {
  return ALARM_SOUNDS.find((s) => s.id === id) ?? ALARM_SOUNDS[0];
}

/** Sound files actually copied into the native bundle at build time. */
const BUNDLED_ALARM_SOUND_FILES = new Set<string>();

/**
 * Returns a bundled file name for AlarmKit, or undefined to use the system alarm
 * sound when the selected file is not in the app bundle yet.
 */
export function alarmKitSoundFileName(id: string): string | undefined {
  const sound = soundById(id);
  if (sound.id === "system" || !sound.fileName) return undefined;
  if (!BUNDLED_ALARM_SOUND_FILES.has(sound.fileName)) return undefined;
  return sound.fileName;
}
