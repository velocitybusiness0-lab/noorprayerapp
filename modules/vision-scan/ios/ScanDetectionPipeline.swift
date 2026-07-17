import CoreVideo
import Foundation
import ImageIO

struct ScanDetectionResult {
  let detections: [[String: Any]]
  let engine: String
}

/// Runs Core ML SSD (cloud-annotations) and Apple Vision classification together.
final class ScanDetectionPipeline {
  private let coreMLPredictor: SalahObjectPredictor?

  init() {
    if let model = CoreMLModelProvider.shared.model {
      coreMLPredictor = try? SalahObjectPredictor(model: model)
    } else {
      coreMLPredictor = nil
    }
  }

  var hasCoreMLModel: Bool { coreMLPredictor != nil }

  func detect(uri: String) -> ScanDetectionResult {
    guard let loaded = ScanImageLoader.load(from: uri) else {
      return ScanDetectionResult(detections: [], engine: "none")
    }
    return detect(cgImage: loaded.0, orientation: loaded.1)
  }

  func detect(
    cgImage: CGImage,
    orientation: CGImagePropertyOrientation
  ) -> ScanDetectionResult {
    var allDetections: [[String: Any]] = []
    var engines: [String] = []

    if let predictor = coreMLPredictor {
      let coreML = predictor.predict(cgImage: cgImage, orientation: orientation)
      allDetections.append(contentsOf: coreML)
      if !coreML.isEmpty {
        engines.append(CoreMLModelProvider.shared.modelName ?? "coreml")
      }
    }

    let vision = VisionImageClassifier.classify(cgImage: cgImage, orientation: orientation)
    allDetections.append(contentsOf: vision)
    if !vision.isEmpty {
      engines.append("vision")
    }

    let engineLabel = engines.isEmpty ? "none" : engines.joined(separator: "+")
    return ScanDetectionResult(detections: allDetections, engine: engineLabel)
  }

  func detect(
    pixelBuffer: CVPixelBuffer,
    orientation: CGImagePropertyOrientation
  ) -> ScanDetectionResult {
    var allDetections: [[String: Any]] = []
    var engines: [String] = []

    if let predictor = coreMLPredictor {
      let coreML = predictor.predict(pixelBuffer: pixelBuffer, orientation: orientation)
      allDetections.append(contentsOf: coreML)
      if !coreML.isEmpty {
        engines.append(CoreMLModelProvider.shared.modelName ?? "coreml")
      }
    }

    let vision = VisionImageClassifier.classify(pixelBuffer: pixelBuffer, orientation: orientation)
    allDetections.append(contentsOf: vision)
    if !vision.isEmpty {
      engines.append("vision")
    }

    let engineLabel = engines.isEmpty ? "none" : engines.joined(separator: "+")
    return ScanDetectionResult(detections: allDetections, engine: engineLabel)
  }
}
