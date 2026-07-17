package expo.modules.visionscan

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageFormat
import android.graphics.Rect
import android.graphics.YuvImage
import androidx.camera.core.ImageProxy
import java.io.ByteArrayOutputStream

/** Converts CameraX analysis frames into bitmaps for MediaPipe inference. */
object ImageProxyBitmapConverter {
  fun toBitmap(imageProxy: ImageProxy): Bitmap? {
    return when (imageProxy.format) {
      ImageFormat.YUV_420_888 -> yuvToBitmap(imageProxy)
      else -> rgbaToBitmap(imageProxy)
    }
  }

  private fun rgbaToBitmap(imageProxy: ImageProxy): Bitmap? {
    val plane = imageProxy.planes.firstOrNull() ?: return null
    val buffer = plane.buffer
    buffer.rewind()
    val bitmap = Bitmap.createBitmap(
      imageProxy.width,
      imageProxy.height,
      Bitmap.Config.ARGB_8888,
    )
    bitmap.copyPixelsFromBuffer(buffer)
    return bitmap
  }

  private fun yuvToBitmap(imageProxy: ImageProxy): Bitmap? {
    if (imageProxy.planes.size < 3) return null

    val nv21 = Yuv420ToNv21Converter.convert(
      width = imageProxy.width,
      height = imageProxy.height,
      yBuffer = imageProxy.planes[0].buffer,
      uBuffer = imageProxy.planes[1].buffer,
      vBuffer = imageProxy.planes[2].buffer,
      yRowStride = imageProxy.planes[0].rowStride,
      uvRowStride = imageProxy.planes[1].rowStride,
      uvPixelStride = imageProxy.planes[1].pixelStride,
    )

    val yuvImage = YuvImage(
      nv21,
      ImageFormat.NV21,
      imageProxy.width,
      imageProxy.height,
      null,
    )
    val jpeg = ByteArrayOutputStream()
    if (!yuvImage.compressToJpeg(Rect(0, 0, imageProxy.width, imageProxy.height), 85, jpeg)) {
      return null
    }
    return BitmapFactory.decodeByteArray(jpeg.toByteArray(), 0, jpeg.size())
  }
}
