# Noor - Requirements Traceability

This file maps every requirement from the original request to its implementation
and current status. It is re-checked before and after each build phase.

Status legend: `DONE` implemented and type-checked / `WIP` in progress /
`TODO` not started / `NATIVE` correct in code but only fully verifiable on an
iOS 26 device with entitlements.

## Problems -> Solutions (from the problems image)
| Problem | Solution in app | Status |
| --- | --- | --- |
| Missing Namaz | Smart alarm at salah time (AlarmKit) | NATIVE (Phase 4) |
| Can't pray all 5 | Schedule + soft reminders | DONE (Phase 2) |
| Inconsistent | Schedule + soft reminders + streaks | DONE (Phase 2/3) |
| Motivation | Reminders ("what's to come / reasons why") | DONE (Phase 2) |
| Procrastination | App blockers (Screen Time) | NATIVE (Phase 6) |
| Don't know prayer times | Accurate timetable by location | DONE (Phase 1) |

## Feature checklist
| # | Requirement | Where | Status |
| --- | --- | --- | --- |
| 1 | Native iOS app (Expo/RN per user choice, cloud-buildable) | whole repo | DONE |
| 2 | Alarm at salah time via AlarmKit | `features/alarm` | NATIVE (code done) |
| 3 | Folder for custom + user alarm sounds | `assets/sounds` | DONE |
| 4 | Source good royalty-free alarm/adhan sounds | `assets/sounds/README` | DONE |
| 5 | Accurate qibla via compass | `features/qibla` | DONE |
| 6 | Accurate salah times from location | `features/prayerTimes` + `features/location` | DONE |
| 7 | Multiple user-selectable modes | `features/modes/ModeCoordinator` | DONE |
| 7a | Mode: salah -> alarm -> scan to disarm | `features/alarm` + `features/scan` | NATIVE (flow done) |
| 7b | Mode: salah -> block apps -> scan to unblock | `features/blocking` + `features/scan` | NATIVE (flow done) |
| 7c | Mode: salah -> reminders/notifs only | `features/notifications` | DONE |
| 8 | Screen Time app blocking (FamilyControls) | `features/blocking` | NATIVE (code done) |
| 9 | Camera object verification (CoreML) | `features/scan/detection` | DONE (pluggable; model = NATIVE) |
| 9a | Scan items relate to salah (mat/sink/masjid) | `features/scan/detection` | DONE |
| 10 | Pre-disarm / Masjid mode toggle | `features/masjidMode` | DONE |
| 10a | Location-based mosque detection (auto/ask off) | `features/masjidMode` | DONE |
| 10b | Pre-disarm by scanning mosque/wudhu/sink | `features/scan` + `features/masjidMode` | DONE |
| 11 | Streaks + prayer history | `features/history` | DONE |
| 12 | Gamification to reward all 5 salah | `features/gamification` | DONE |
| 13 | Tahajjud (last third of night) | `features/tahajjud` | DONE |
| 14 | Istikhara support | `features/tahajjud` / times | DONE |
| 15 | Accurate salah timetable | `app/(tabs)/timetable` | DONE |
| 16 | 15-min "did you pray?" follow-up to log | `features/notifications` | DONE |
| 17 | Tap a salah to mark complete (auto on verify) | `features/history` + home | DONE (auto-on-scan in Phase 5) |
| 18 | Soft-notification mode at salah start | `features/notifications` | DONE |
| 19 | Live activities for salah times | `targets/widget` + `modules/live-activity` | NATIVE (code done) |
| 20 | Home + lock-screen widgets | `targets/widget` | NATIVE (code done) |
| 21 | Notifications additive: always manual check/log | home + timetable | DONE |

## Design checklist
| # | Requirement | Where | Status |
| --- | --- | --- | --- |
| D1 | Black & white palette | `core/theme/colors.ts` | DONE |
| D2 | Dark default, NOT true-black, NOT grey (deep near-black) | `core/theme/colors.ts` (#0B0B0C) | DONE |
| D3 | Light mode available | `core/theme/colors.ts` + `ThemeProvider` | DONE |
| D4 | Translucent UI (tab bar opacity gradient) | `components/navigation/BlurTabBar.tsx` | DONE |
| D5 | Haptic feedback on UI elements | `core/haptics/HapticsManager.ts` | DONE |
| D6 | Sleek, responsive, professional | reanimated transitions, primitives | DONE |
| D7 | Simple to set up / edit | central theme + managers, README | DONE |
| D8 | Home layout per reference (arc, streak, list) | `components/home/*` | DONE |
| D9 | Live activity / widget layouts per reference | `targets/widget` | NATIVE (code done) |

## Architecture rules (user rules)
- Files < 500 lines, split at ~400: enforced per file.
- OOP-first: managers/coordinators as classes; views separate from logic.
- Single responsibility: one concern per file.
- Managers (business logic) / ViewModels via hooks (UI logic) / Coordinator (flow).
- Dependency injection for testability.

## Known native-only caveats
- AlarmKit requires iOS 26 hardware + `NSAlarmKitUsageDescription`.
- Screen Time requires `com.apple.developer.family-controls` (dev works locally,
  distribution needs Apple approval) and a real device.
- CoreML detection model for mat/sink/masjid must be trained/provided; a manual
  confirmation fallback always ships.
- `appleTeamId` and App Group must be filled in `app.json` before EAS build.
- Widgets + Live Activity live in `targets/widget` (built by the
  `@kingstinct/expo-apple-targets` scanner that `react-native-device-activity`
  already runs, so no extra config plugin is needed). Live Activity start/update
  and the app-group snapshot write are handled by the local `modules/live-activity`
  Expo module and only run in a dev/EAS build, not Expo Go.
