package expo.modules.visionscan

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class VisionScanModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("VisionScan")

    OnCreate {
      val context = requireContext()
      val detector = MediaPipeObjectDetector(context)
      VisionScanDetectorRegistry.detector = detector
    }

    OnDestroy {
      VisionScanDetectorRegistry.detector?.close()
      VisionScanDetectorRegistry.detector = null
    }

    Function("isSupported") {
      VisionScanDetectorRegistry.detector?.isAvailable == true
    }

    Function("hasCoreMLModel") {
      false
    }

    Function("hasLiveCamera") {
      VisionScanDetectorRegistry.detector?.isAvailable == true
    }

    Function("detectionEngine") {
      if (VisionScanDetectorRegistry.detector?.isAvailable == true) "mediapipe" else "none"
    }

    View(LiveScanCameraView::class) {
      Events("onDetections")
      Prop("active") { view: LiveScanCameraView, active: Boolean ->
        view.setActive(active)
      }
    }

    AsyncFunction("classifyImage") { uri: String ->
      runDetection(uri).detections
    }

    AsyncFunction("detectImage") { uri: String ->
      val result = runDetection(uri)
      mapOf(
        "engine" to result.engine,
        "detections" to result.detections,
      )
    }
  }

  private fun runDetection(uri: String): ScanDetectionPayload {
    val active = VisionScanDetectorRegistry.detector
      ?: return ScanDetectionPayload("none", emptyList())
    val bitmap = ScanImageLoader.loadBitmap(uri)
      ?: return ScanDetectionPayload("none", emptyList())
    return try {
      active.detect(bitmap)
    } finally {
      bitmap.recycle()
    }
  }

  private fun requireContext(): android.content.Context {
    return appContext.reactContext?.applicationContext
      ?: throw IllegalStateException("React context is not available")
  }
}
