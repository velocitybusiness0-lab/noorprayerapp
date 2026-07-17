import CoreML

/// Loads a Core ML SSD model trained via cloud-annotations/object-detection-ios.
final class CoreMLModelProvider {
  static let shared = CoreMLModelProvider()

  private(set) var model: MLModel?
  private(set) var modelName: String?

  private init() {
    loadFirstAvailable()
  }

  var isLoaded: Bool { model != nil }

  private func loadFirstAvailable() {
    let candidates = ["SalahObjects", "Model", "MobileNetV2_SSDLite"]
    let bundles: [Bundle] = [
      Bundle(for: CoreMLModelProvider.self),
      Bundle.main,
    ]

    for bundle in bundles {
      for name in candidates {
        if let url = bundle.url(forResource: name, withExtension: "mlmodelc")
          ?? bundle.url(forResource: name, withExtension: "mlmodel"),
          let loaded = try? MLModel(contentsOf: url) {
          model = loaded
          modelName = name
          return
        }
      }
    }
  }
}
