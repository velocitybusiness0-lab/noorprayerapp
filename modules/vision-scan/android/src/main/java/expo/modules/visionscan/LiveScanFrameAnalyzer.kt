package expo.modules.visionscan

import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Throttled CameraX analyzer — reads preview frames without ImageCapture so the
 * preview never flashes white on Samsung and other Android devices.
 */
class LiveScanFrameAnalyzer(
  private val detectorProvider: () -> MediaPipeObjectDetector?,
  private val onDetections: (ScanDetectionPayload) -> Unit,
) : ImageAnalysis.Analyzer {
  private val busy = AtomicBoolean(false)
  private var lastAnalyzedAt = 0L

  override fun analyze(imageProxy: ImageProxy) {
    val now = System.currentTimeMillis()
    if (now - lastAnalyzedAt < ANALYSIS_INTERVAL_MS || !busy.compareAndSet(false, true)) {
      imageProxy.close()
      return
    }
    lastAnalyzedAt = now

    try {
      val detector = detectorProvider() ?: return
      val bitmap = ImageProxyBitmapConverter.toBitmap(imageProxy) ?: return
      try {
        onDetections(detector.detect(bitmap))
      } finally {
        bitmap.recycle()
      }
    } catch (_: Exception) {
      // Ignore transient frame errors; the next frame retries.
    } finally {
      busy.set(false)
      imageProxy.close()
    }
  }

  companion object {
    private const val ANALYSIS_INTERVAL_MS = 650L
  }
}
