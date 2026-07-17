package expo.modules.visionscan

import android.content.Context
import android.graphics.Bitmap
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.objectdetector.ObjectDetector

data class ScanDetectionPayload(
  val engine: String,
  val detections: List<Map<String, Any>>,
)

/**
 * MediaPipe EfficientDet-Lite0 object detector (COCO labels).
 * @see https://developers.google.com/edge/mediapipe/solutions/vision/object_detector/android
 */
class MediaPipeObjectDetector(context: Context) {
  private val detector: ObjectDetector? = createDetector(context)

  val isAvailable: Boolean
    get() = detector != null

  fun close() {
    detector?.close()
  }

  fun detect(bitmap: Bitmap): ScanDetectionPayload {
    val active = detector ?: return ScanDetectionPayload("none", emptyList())

    return try {
      val mpImage = BitmapImageBuilder(bitmap).build()
      val result = active.detect(mpImage)
      val detections = result.detections().mapNotNull { detection ->
        val category = detection.categories().firstOrNull() ?: return@mapNotNull null
        val score = category.score()
        if (score < MIN_SCORE) return@mapNotNull null
        mapOf(
          "label" to category.categoryName(),
          "confidence" to score.toDouble(),
          "source" to "mediapipe",
        )
      }
      ScanDetectionPayload("mediapipe", detections)
    } catch (_: Exception) {
      ScanDetectionPayload("none", emptyList())
    }
  }

  private fun createDetector(context: Context): ObjectDetector? {
    return try {
      val baseOptions = BaseOptions.builder()
        .setModelAssetPath(MODEL_ASSET)
        .build()
      val options = ObjectDetector.ObjectDetectorOptions.builder()
        .setBaseOptions(baseOptions)
        .setRunningMode(RunningMode.IMAGE)
        .setScoreThreshold(MIN_SCORE)
        .setMaxResults(MAX_RESULTS)
        .build()
      ObjectDetector.createFromOptions(context, options)
    } catch (_: Exception) {
      null
    }
  }

  companion object {
    private const val MODEL_ASSET = "efficientdet_lite0.tflite"
    private const val MIN_SCORE = 0.28f
    private const val MAX_RESULTS = 10
  }
}
