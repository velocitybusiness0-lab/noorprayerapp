package expo.modules.visionscan

/** Shared MediaPipe detector used by file-based and live camera scan paths. */
object VisionScanDetectorRegistry {
  var detector: MediaPipeObjectDetector? = null
}
