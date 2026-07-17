package expo.modules.visionscan

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.media.ExifInterface

/** Loads a camera still from a file URI into an upright bitmap for inference. */
object ScanImageLoader {
  fun loadBitmap(uri: String): Bitmap? {
    val path = if (uri.startsWith("file://")) uri.removePrefix("file://") else uri
    val bitmap = BitmapFactory.decodeFile(path) ?: return null
    return applyExifOrientation(bitmap, path)
  }

  private fun applyExifOrientation(bitmap: Bitmap, path: String): Bitmap {
    val rotation = try {
      val exif = ExifInterface(path)
      when (exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)) {
        ExifInterface.ORIENTATION_ROTATE_90 -> 90f
        ExifInterface.ORIENTATION_ROTATE_180 -> 180f
        ExifInterface.ORIENTATION_ROTATE_270 -> 270f
        else -> return bitmap
      }
    } catch (_: Exception) {
      return bitmap
    }

    val matrix = Matrix().apply { postRotate(rotation) }
    val rotated = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
    if (rotated !== bitmap) bitmap.recycle()
    return rotated
  }
}
