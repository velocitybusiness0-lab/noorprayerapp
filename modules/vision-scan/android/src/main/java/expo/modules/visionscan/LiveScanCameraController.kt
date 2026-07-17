package expo.modules.visionscan

import android.content.Context
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import java.util.concurrent.Executors

/** Binds CameraX preview + analysis for flash-free live object hunt. */
class LiveScanCameraController(
  private val context: Context,
  private val previewView: PreviewView,
  private val detectorProvider: () -> MediaPipeObjectDetector?,
  private val onDetections: (ScanDetectionPayload) -> Unit,
) {
  private val cameraExecutor = Executors.newSingleThreadExecutor()
  private var cameraProvider: ProcessCameraProvider? = null

  fun start(lifecycleOwner: LifecycleOwner) {
    val future = ProcessCameraProvider.getInstance(context)
    future.addListener(
      {
        cameraProvider = future.get()
        bindUseCases(lifecycleOwner)
      },
      ContextCompat.getMainExecutor(context),
    )
  }

  fun stop() {
    cameraProvider?.unbindAll()
  }

  fun shutdown() {
    stop()
    cameraExecutor.shutdown()
  }

  private fun bindUseCases(lifecycleOwner: LifecycleOwner) {
    val provider = cameraProvider ?: return
    provider.unbindAll()

    val preview = Preview.Builder().build().also {
      it.surfaceProvider = previewView.surfaceProvider
    }

    val analysis = ImageAnalysis.Builder()
      .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
      .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
      .build()
      .also {
        it.setAnalyzer(
          cameraExecutor,
          LiveScanFrameAnalyzer(detectorProvider, onDetections),
        )
      }

    provider.bindToLifecycle(
      lifecycleOwner,
      CameraSelector.DEFAULT_BACK_CAMERA,
      preview,
      analysis,
    )
  }
}
