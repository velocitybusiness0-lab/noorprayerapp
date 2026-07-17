import CoreML
import CoreVideo
import Vision

/// SSD object detection adapted from cloud-annotations/object-detection-ios.
final class SalahObjectPredictor {
  private let visionModel: VNCoreMLModel

  init(model: MLModel) throws {
    visionModel = try VNCoreMLModel(for: model)
  }

  func predict(
    cgImage: CGImage,
    orientation: CGImagePropertyOrientation,
    minConfidence: Float = 0.35
  ) -> [[String: Any]] {
    let request = VNCoreMLRequest(model: visionModel)
    request.imageCropAndScaleOption = .scaleFill

    let handler = VNImageRequestHandler(cgImage: cgImage, orientation: orientation, options: [:])
    return perform(request: request, handler: handler, minConfidence: minConfidence)
  }

  func predict(
    pixelBuffer: CVPixelBuffer,
    orientation: CGImagePropertyOrientation,
    minConfidence: Float = 0.35
  ) -> [[String: Any]] {
    let request = VNCoreMLRequest(model: visionModel)
    request.imageCropAndScaleOption = .scaleFill

    let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: orientation, options: [:])
    return perform(request: request, handler: handler, minConfidence: minConfidence)
  }

  private func perform(
    request: VNCoreMLRequest,
    handler: VNImageRequestHandler,
    minConfidence: Float
  ) -> [[String: Any]] {
    do {
      try handler.perform([request])
    } catch {
      return []
    }

    guard let observations = request.results as? [VNRecognizedObjectObservation] else {
      return []
    }

    return observations.compactMap { observation in
      guard let label = observation.labels.first?.identifier,
            observation.confidence >= minConfidence else {
        return nil
      }
      return [
        "label": label,
        "confidence": Double(observation.confidence),
        "source": "coreml",
      ]
    }
  }
}
