# Object detection model (prayer mat / sink / masjid)

Miraj uses platform-native detectors in `modules/vision-scan/`:

- **iOS:** [cloud-annotations/object-detection-ios](https://github.com/cloud-annotations/object-detection-ios) Core ML SSD + Apple Vision `VNClassifyImageRequest`
- **Android:** [MediaPipe Object Detector](https://developers.google.com/edge/mediapipe/solutions/vision/object_detector/android) EfficientDet-Lite0 (COCO)

## Quick start (starter models)

```bash
node scripts/fetch-detection-model.js
eas build --profile development --platform ios    # or android
```

This downloads:

- **iOS:** MobileNetV2 SSD Lite → `modules/vision-scan/ios/Models/`
- **Android:** EfficientDet-Lite0 int8 → `modules/vision-scan/android/src/main/assets/`

Rebuild and install the new dev client.

## Dev build vs Metro reload

Automatic camera detection needs a native dev build with **vision-scan** compiled in. **Metro reload only updates JavaScript** — it cannot add native modules.

| Feature | Needs dev build? |
| --- | --- |
| Keyword maps / matcher logic | No — Metro reload is enough |
| iOS Core ML object detection | Yes |
| iOS Apple Vision classification | Yes |
| Android MediaPipe object detection | Yes |
| "Verify manually" fallback | No |

If logs show `status=missing_module visionModule=no`, the app on your phone is still an older build without vision-scan.

### Install build 40150343 (iOS)

Latest iOS build with vision-scan (fingerprint `08704d85…`, finished 22:05):

https://expo.dev/accounts/spiralwoo/projects/noor-prayer-app/builds/40150343-5c79-4869-888c-6cbcbf4d4c4f

On your phone:

1. Delete the Miraj app (long-press → Remove App / Uninstall)
2. Open that link on your phone → Install
3. Open Miraj from the home screen (not Expo Go)
4. Connect to Metro (`npx expo start --dev-client` on your PC, same Wi‑Fi)

For Android, run `npm run build:android:dev` and install the resulting APK.

### How to know it worked

Metro should log one of:

```
[Scan] Core ML (MobileNetV2_SSDLite+vision) — COCO + Vision keywords linked
[Scan] MediaPipe (EfficientDet-Lite0) — COCO keywords linked
status=ready visionModule=yes
```

## Custom salah model (iOS recommended)

Train classes for your environment (`sink`, `prayer mat`, `mosque`, etc.):

1. Follow [cloud-annotations/training](https://github.com/cloud-annotations/training)
2. Copy the generated `model_ios` folder into `modules/vision-scan/ios/Models/`
3. Name the model `Model.mlmodel` or `SalahObjects.mlmodel`
4. Rebuild the iOS dev client

Keywords are linked to detectors in `src/features/scan/detection/DetectorKeywordMaps.ts`:

- **COCO (Core ML / MediaPipe):** `sink`, `toilet` from object-detection models
- **Vision (iOS only):** `kitchen_sink`, `bath`, `toilet_seat`, `yoga`, `dome`, etc.
- **Custom model:** `customLabels` in `src/features/scan/scanTargets.ts`

## How it works

- **Native iOS:** `modules/vision-scan/ios/` — Core ML SSD + Vision; labels tagged `coreml` or `vision`
- **Native Android:** `modules/vision-scan/android/` — MediaPipe EfficientDet-Lite0; labels tagged `mediapipe`
- **JS:** `NativeObjectDetector` → `ScanLabelMatcher` (engine-aware) → `ScanManager`

## Adjust keywords

- **COCO / Vision:** edit `DetectorKeywordMaps.ts`
- **Custom trained model:** edit `customLabels` in `scanTargets.ts`
