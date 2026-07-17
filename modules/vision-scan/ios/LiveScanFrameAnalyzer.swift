import AVFoundation
import ExpoModulesCore

final class LiveScanFrameAnalyzer {
  private let pipeline = ScanDetectionPipeline()
  var onDetections: (([String: Any]) -> Void)?
  private var lastAnalyzedAt: TimeInterval = 0
  private var isBusy = false

  func analyze(pixelBuffer: CVPixelBuffer) {
    let now = Date().timeIntervalSince1970
    guard now - lastAnalyzedAt >= 0.9, !isBusy else { return }
    lastAnalyzedAt = now
    isBusy = true

    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      guard let self else { return }
      // The video output connection physically rotates buffers to portrait.
      // Vision must receive `.up` to avoid applying a second rotation.
      let result = self.pipeline.detect(pixelBuffer: pixelBuffer, orientation: .up)
      DispatchQueue.main.async {
        self.isBusy = false
        self.onDetections?([
          "engine": result.engine,
          "detections": result.detections,
        ])
      }
    }
  }
}
