/**
 * Downloads on-device detection models for iOS (Core ML) and Android (MediaPipe TFLite).
 *
 * iOS: MobileNetV2 SSD Lite (cloud-annotations / COCO)
 * Android: EfficientDet-Lite0 int8 (Google MediaPipe)
 * @see https://developers.google.com/edge/mediapipe/solutions/vision/object_detector/android
 */
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const IOS_MODEL_SOURCES = [
  {
    name: "ObjectDetection-CoreML release",
    url: "https://github.com/tucan9389/ObjectDetection-CoreML/releases/download/etc-models/MobileNetV2_SSDLite.mlmodel",
  },
  {
    name: "coremlmodels mirror",
    url: "https://raw.githubusercontent.com/gouthamk1998/coremlmodels/master/MobileNetV2_SSDLite.mlmodel",
  },
  {
    name: "coreml-survival-guide mirror",
    url: "https://github.com/hollance/coreml-survival-guide/raw/master/MobileNetV2%2BSSDLite/ObjectDetection/ObjectDetection/MobileNetV2_SSDLite.mlmodel",
  },
];

const ANDROID_MODEL = {
  name: "MediaPipe EfficientDet-Lite0 int8",
  url: "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite",
};

const IOS_OUT_DIR = path.join(__dirname, "..", "modules", "vision-scan", "ios", "Models");
const IOS_OUT_FILE = path.join(IOS_OUT_DIR, "MobileNetV2_SSDLite.mlmodel");
const ANDROID_OUT_DIR = path.join(__dirname, "..", "modules", "vision-scan", "android", "src", "main", "assets");
const ANDROID_OUT_FILE = path.join(ANDROID_OUT_DIR, "efficientdet_lite0.tflite");
const IOS_MIN_BYTES = 5_000_000;
const ANDROID_MIN_BYTES = 3_000_000;

function fetchModule(url) {
  const lib = url.startsWith("https") ? https : http;
  return new Promise((resolve, reject) => {
    const request = lib.get(
      url,
      {
        headers: {
          "User-Agent": "Miraj-Prayer-App/1.0 (model-fetch)",
          Accept: "*/*",
        },
      },
      (response) => {
        const { statusCode, headers } = response;

        if (statusCode >= 300 && statusCode < 400 && headers.location) {
          response.resume();
          fetchModule(headers.location).then(resolve).catch(reject);
          return;
        }

        if (statusCode !== 200) {
          response.resume();
          reject(new Error(`HTTP ${statusCode}`));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
        response.on("error", reject);
      }
    );
    request.on("error", reject);
  });
}

async function downloadFrom(source, minBytes) {
  console.log(`Trying ${source.name}...`);
  const data = await fetchModule(source.url);
  if (data.length < minBytes) {
    throw new Error(`file too small (${data.length} bytes)`);
  }
  return data;
}

async function downloadIosModel() {
  fs.mkdirSync(IOS_OUT_DIR, { recursive: true });

  let lastError = "no sources configured";
  for (const source of IOS_MODEL_SOURCES) {
    try {
      const data = await downloadFrom(source, IOS_MIN_BYTES);
      fs.writeFileSync(IOS_OUT_FILE, data);
      console.log(`Saved iOS model ${(data.length / 1_000_000).toFixed(1)} MB to ${IOS_OUT_FILE}`);
      return;
    } catch (error) {
      lastError = error.message;
      console.warn(`  iOS mirror failed: ${lastError}`);
    }
  }

  throw new Error(`All iOS download mirrors failed (last: ${lastError}).`);
}

async function downloadAndroidModel() {
  fs.mkdirSync(ANDROID_OUT_DIR, { recursive: true });
  const data = await downloadFrom(ANDROID_MODEL, ANDROID_MIN_BYTES);
  fs.writeFileSync(ANDROID_OUT_FILE, data);
  console.log(`Saved Android model ${(data.length / 1_000_000).toFixed(1)} MB to ${ANDROID_OUT_FILE}`);
}

async function main() {
  await downloadIosModel();
  await downloadAndroidModel();
  console.log("Rebuild the dev client (eas build) to bundle both models.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
