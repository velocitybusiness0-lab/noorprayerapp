package expo.modules.visionscan

import java.nio.ByteBuffer

/** Converts CameraX YUV_420_888 planes into NV21 for JPEG compression. */
object Yuv420ToNv21Converter {
  fun convert(
    width: Int,
    height: Int,
    yBuffer: ByteBuffer,
    uBuffer: ByteBuffer,
    vBuffer: ByteBuffer,
    yRowStride: Int,
    uvRowStride: Int,
    uvPixelStride: Int,
  ): ByteArray {
    val nv21 = ByteArray(width * height + width * height / 2)
    copyYPlane(yBuffer, nv21, width, height, yRowStride)
    interleaveVuPlanes(uBuffer, vBuffer, nv21, width, height, uvRowStride, uvPixelStride)
    return nv21
  }

  private fun copyYPlane(
    yBuffer: ByteBuffer,
    output: ByteArray,
    width: Int,
    height: Int,
    rowStride: Int,
  ) {
    var outputOffset = 0
    if (rowStride == width) {
      yBuffer.position(0)
      yBuffer.get(output, 0, width * height)
      return
    }

    for (row in 0 until height) {
      yBuffer.position(row * rowStride)
      yBuffer.get(output, outputOffset, width)
      outputOffset += width
    }
  }

  private fun interleaveVuPlanes(
    uBuffer: ByteBuffer,
    vBuffer: ByteBuffer,
    output: ByteArray,
    width: Int,
    height: Int,
    rowStride: Int,
    pixelStride: Int,
  ) {
    val chromaHeight = height / 2
    val chromaWidth = width / 2
    var outputOffset = width * height

    if (pixelStride == 2 && rowStride == width) {
      vBuffer.position(0)
      vBuffer.get(output, outputOffset, width * chromaHeight)
      return
    }

    for (row in 0 until chromaHeight) {
      var columnOffset = row * rowStride
      for (column in 0 until chromaWidth) {
        output[outputOffset++] = vBuffer.get(columnOffset)
        output[outputOffset++] = uBuffer.get(columnOffset)
        columnOffset += pixelStride
      }
    }
  }
}
