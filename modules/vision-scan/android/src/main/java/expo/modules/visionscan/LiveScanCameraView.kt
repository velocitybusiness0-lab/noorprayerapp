package expo.modules.visionscan

import android.content.Context
import android.widget.FrameLayout
import androidx.camera.view.PreviewView
import androidx.lifecycle.LifecycleOwner
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

/** Native camera preview that analyzes live frames without takePictureAsync. */
class LiveScanCameraView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onDetections by EventDispatcher()
  private val previewView = PreviewView(context).apply {
    layoutParams = FrameLayout.LayoutParams(
      FrameLayout.LayoutParams.MATCH_PARENT,
      FrameLayout.LayoutParams.MATCH_PARENT,
    )
    implementationMode = PreviewView.ImplementationMode.PERFORMANCE
    scaleType = PreviewView.ScaleType.FILL_CENTER
  }

  private val controller = LiveScanCameraController(
    context = context,
    previewView = previewView,
    detectorProvider = { VisionScanDetectorRegistry.detector },
    onDetections = { payload ->
      if (!wantsActive) return@LiveScanCameraController
      onDetections(
        mapOf(
          "engine" to payload.engine,
          "detections" to payload.detections,
        ),
      )
    },
  )

  private var wantsActive = false

  init {
    addView(previewView)
  }

  fun setActive(value: Boolean) {
    wantsActive = value
    applyActiveState()
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    post { applyActiveState() }
  }

  override fun onDetachedFromWindow() {
    controller.shutdown()
    super.onDetachedFromWindow()
  }

  private fun applyActiveState() {
    val owner = appContext.currentActivity as? LifecycleOwner
    if (owner == null) {
      if (!wantsActive) controller.stop()
      return
    }
    if (wantsActive) controller.start(owner) else controller.stop()
  }
}
