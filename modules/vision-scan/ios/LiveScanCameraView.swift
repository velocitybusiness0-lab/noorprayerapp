import ExpoModulesCore

final class LiveScanCameraView: ExpoView {
  let onDetections = EventDispatcher()
  private let controller = LiveScanCameraController()
  private let analyzer = LiveScanFrameAnalyzer()
  private var active = false

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    layer.addSublayer(controller.previewLayer)
    analyzer.onDetections = { [weak self] payload in
      self?.onDetections(payload)
    }
    controller.onFrame = { [weak self] pixelBuffer in
      guard let self, self.active else { return }
      self.analyzer.analyze(pixelBuffer: pixelBuffer)
    }
  }

  func setActive(_ value: Bool) {
    active = value
    updateCameraState()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    controller.previewLayer.frame = bounds
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    updateCameraState()
  }

  private func updateCameraState() {
    if active && window != nil {
      controller.start()
    } else {
      controller.stop()
    }
  }
}
