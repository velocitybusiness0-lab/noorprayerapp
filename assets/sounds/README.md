# Alarm & Adhan sounds

Drop custom alarm/adhan audio files here. The app references them by file name
in `src/features/alarm/alarmSounds.ts`. AlarmKit loads the sound from the app
bundle, so the file must be included in the native build.

## Expected files (match `alarmSounds.ts`)

| Sound id        | Expected file          |
| --------------- | ---------------------- |
| `adhan_makkah`  | `adhan_makkah.caf`     |
| `adhan_madinah` | `adhan_madinah.caf`    |
| `takbir`        | `takbir.caf`           |
| `soft_chime`    | `soft_chime.caf`       |
| `gentle_bells`  | `gentle_bells.caf`     |

`system` uses the default system alarm sound (no file needed).

## Format

- Prefer Apple's `.caf` (Core Audio Format) for alarm sounds, or `.wav` / short
  `.mp3`. Keep alarm loops under ~30s.
- Convert to CAF on any machine with:
  `afconvert input.mp3 output.caf -d ima4 -f caff -v` (macOS), or use an online
  converter, then place the result here.

## Adding a new sound

1. Add the audio file to this folder.
2. Add an entry to `ALARM_SOUNDS` in `src/features/alarm/alarmSounds.ts`.
3. Rebuild the dev client (sounds are bundled at build time).

## Royalty-free sources

Use audio you have the right to bundle. Good sources for free/royalty-free
adhan and alarm tones:

- Pixabay Sounds (https://pixabay.com/sound-effects/) - CC0.
- Freesound (https://freesound.org/) - check each file's license (prefer CC0).
- Mixkit (https://mixkit.co/free-sound-effects/alarm/) - free license.
- Many masjids publish their own adhan recordings; confirm permission first.

Do not commit copyrighted recordings without a license.
