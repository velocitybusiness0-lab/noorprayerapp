# Noor — Muslim Prayer App

A black-and-white, sleek iOS prayer companion built with **Expo + React Native + TypeScript** and cloud-built with **EAS** (no Mac required to develop). Noor covers accurate prayer times, a qibla compass, smart AlarmKit alarms with scan-to-disarm, Screen Time app-blocking, masjid mode, streaks/gamification, tahajjud/istikhara, additive reminders, and Home Screen widgets + Live Activities.

> Traceability of every requirement lives in [`REQUIREMENTS.md`](./REQUIREMENTS.md).

## Feature overview

- **Accurate salah times** from your location using `adhan` with configurable calculation method, madhab, and high-latitude rule.
- **Qibla compass** driven by the magnetometer with a smooth animated needle.
- **Three per-prayer modes** wired through a single `ModeCoordinator`:
  1. Alarm at salah time → scan your prayer mat / sink / masjid to disarm.
  2. Block chosen (or all) apps via Screen Time → scan to unblock.
  3. Soft reminder / notification only.
- **Masjid mode**: near a saved masjid, alarms and blocks soften to a quiet check-in. Manual **pre-disarm** by scanning the wudhu/masjid area silences the next alarm ahead of time.
- **Reminders are additive** — you can always open the app to see times and tap a prayer to log it, with an optional 15-minute “Did you pray?” follow-up.
- **History, streaks, and gamification** persisted in SQLite with badges/levels.
- **Tahajjud** (last third of the night) and **istikhara** surfaced in the timetable.
- **Widgets & Live Activities**: medium + small + lock-screen widgets and a Dynamic Island countdown.

## Prerequisites

- A **paid Apple Developer account** (needed for AlarmKit and the Screen Time / `com.apple.developer.family-controls` entitlement).
- An **Expo / EAS account** for cloud builds.
- A **physical iOS 26+ device** — alarms, app-blocking, camera, widgets, and Live Activities do **not** work in the Simulator or in Expo Go.
- Node 18+ and the EAS CLI: `npm i -g eas-cli`.

## Setup

```bash
npm install
```

Fill in the two placeholders in `app.json` before building:

- `ios.appleTeamId` and the `react-native-device-activity` plugin `appleTeamId` → your Apple Team ID.
- The App Group `group.com.noor.prayerapp` is pre-wired across the app, the widget, and the device-activity extension. Keep it identical everywhere if you rename it.

### Cloud build (EAS)

```bash
eas login
eas build --profile development --platform ios   # dev client for on-device testing
```

Install the resulting build on your device, then start the bundler:

```bash
npx expo start --dev-client
```

> Type-check any time with `npx tsc --noEmit`.

## Project structure

```
src/
  app/                  expo-router screens: (tabs), alarm/ring, scan/[purpose], onboarding
  core/                 theme/ (colors, typography, spacing), haptics/, storage/ (mmkv + sqlite), utils/
  components/           reusable UI (home, prayer, qibla, settings, navigation, primitives)
  features/             one folder per domain, each with a Manager (logic), a use* hook (VM), and *.types.ts
    prayerTimes/ qibla/ location/ notifications/ history/ gamification/ tahajjud/
    alarm/ scan/ blocking/ masjidMode/ modes/ (ModeCoordinator) widgets/ bootstrap/
targets/widget/         WidgetKit widgets + Live Activity (Swift)
modules/live-activity/  local Expo module: ActivityKit control + app-group snapshot + widget reload
assets/                 images, sounds (custom alarm/adhan), models (CoreML detector)
```

The build follows a strict separation: **Managers** hold business logic, **`use*` hooks** are view-models, and **`ModeCoordinator`** owns flow. Files are kept small and single-responsibility.

## How things fit together

`useAppBootstrap` is the single orchestration point. It:

1. Initialises notifications, history, alarm + Screen Time authorization, and the scan → unblock handler.
2. Keeps masjid presence fresh from location updates.
3. Publishes the widget snapshot and syncs the Live Activity whenever the day changes.
4. Re-runs the `ModeCoordinator` (reminders + alarms + blocking) whenever anything affecting scheduling changes. When you’re at a masjid or have pre-disarmed a prayer, that prayer softens to a quiet reminder.

## Editing guide (built to be easy to change)

- **Restyle the whole app**: edit `src/core/theme/colors.ts` (dark default is the deep near-black `#0B0B0C`), `typography.ts`, and `spacing.ts`.
- **Change prayer calculation defaults**: `src/features/prayerTimes/prayerTimes.types.ts` (`DEFAULT_CALCULATION_SETTINGS`) and `CalculationConfig.ts`.
- **Add/replace alarm sounds**: drop royalty-free audio into `assets/sounds/` and register it in `src/features/alarm/alarmSounds.ts` (see `assets/sounds/README.md`).
- **Swap the object detector**: implement the `ObjectDetector` interface in `src/features/scan/detection/` and register it in `detectorRegistry.ts`. A manual-confirm fallback always ships; the CoreML model goes in `assets/models/` (see its README).
- **Tune the block window / masjid radius**: `BLOCK_WINDOW_MINUTES` in `BlockingManager.ts`, `DEFAULT_MOSQUE_RADIUS_M` in `masjidMode/masjid.types.ts`.
- **Widget/Live Activity look**: Swift views in `targets/widget/` (`PrayerWidgetView.swift`, `PrayerLiveActivity.swift`). Keep the `PrayerActivityAttributes` schema identical between `targets/widget/` and `modules/live-activity/ios/`.

## Native-only caveats

- **AlarmKit** needs iOS 26 hardware and `NSAlarmKitUsageDescription`.
- **Screen Time** needs the family-controls entitlement (works locally in dev; App Store/TestFlight distribution requires Apple approval) and a real device.
- **CoreML** detection model for mat/sink/masjid must be trained/provided; the manual confirmation fallback works regardless.
- **Widgets + Live Activities** only render in a dev/EAS build, never in Expo Go. iOS project files are generated on macOS/Linux during EAS build — `expo prebuild` is skipped on Windows by design.
