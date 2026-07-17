import CoreVideo
import Vision

/// Apple Vision taxonomy fallback when no custom Core ML model is bundled.
enum VisionImageClassifier {
  static func classify(
    cgImage: CGImage,
    orientation: CGImagePropertyOrientation,
    minConfidence: Float = 0.12
  ) -> [[String: Any]] {
    let request = VNClassifyImageRequest()
    let handler = VNImageRequestHandler(cgImage: cgImage, orientation: orientation, options: [:])
    return perform(request: request, handler: handler, minConfidence: minConfidence)
  }

  static func classify(
    pixelBuffer: CVPixelBuffer,
    orientation: CGImagePropertyOrientation,
    minConfidence: Float = 0.12
  ) -> [[String: Any]] {
    let request = VNClassifyImageRequest()
    let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: orientation, options: [:])
    return perform(request: request, handler: handler, minConfidence: minConfidence)
  }

  private static func perform(
    request: VNClassifyImageRequest,
    handler: VNImageRequestHandler,
    minConfidence: Float
  ) -> [[String: Any]] {

    do {
      try handler.perform([request])
    } catch {
      return []
    }

    guard let observations = request.results as? [VNClassificationObservation] else {
      return []
    }

    return observations
      .filter { $0.confidence >= minConfidence }
      .prefix(20)
      .map { observation in
        [
          "label": observation.identifier,
          "confidence": Double(observation.confidence),
          "source": "vision",
        ]
      }
  }
}
