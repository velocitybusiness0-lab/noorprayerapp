# Object detection model (prayer mat / sink / masjid)

The scan-to-dismiss / scan-to-unblock flow uses a pluggable object detector.
By default the app falls back to **manual confirmation** so nothing is blocked
if no model is present. To enable automatic on-device detection:

## 1. Train / obtain a model

Train a small image classifier or object detector with classes:
`prayer mat`, `sink` (wudhu), `masjid`. A good starting point is
cloud-annotations (https://github.com/cloud-annotations/object-detection-ios),
which exports a Core ML `.mlmodel` you can drop into an iOS build.

Place the compiled model here, e.g. `assets/models/SalahObjects.mlmodelc`.

## 2. Bridge inference to JS

Provide a `NativeClassify` function (see
`src/features/scan/detection/CoreMLObjectDetector.ts`) that takes a still-image
URI and returns `{ label, confidence }[]`. This typically wraps a small native
module / Expo module that runs Vision + Core ML on the captured frame.

## 3. Register the detector at startup

```ts
import { CoreMLObjectDetector } from "@/features/scan/detection/CoreMLObjectDetector";
import { setObjectDetector } from "@/features/scan/detection/detectorRegistry";

setObjectDetector(new CoreMLObjectDetector(nativeClassify));
```

The scan UI automatically switches from manual confirmation to live detection,
matching detections against the labels in `src/features/scan/scanTargets.ts`.

## Notes

- The label strings returned by the model are matched case-insensitively and
  by substring against `modelLabels` in `scanTargets.ts` - adjust those to fit
  your model's output vocabulary.
- Keep the detection threshold (`DETECTION_THRESHOLD`) in `scanTargets.ts`.
