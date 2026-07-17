import UIKit

enum ScanImageLoader {
  static func load(from uri: String) -> (CGImage, CGImagePropertyOrientation)? {
    let path = uri.hasPrefix("file://") ? String(uri.dropFirst("file://".count)) : uri
    guard let image = UIImage(contentsOfFile: path), let cgImage = image.cgImage else {
      return nil
    }
    return (cgImage, CGImagePropertyOrientation(image.imageOrientation))
  }
}

private extension CGImagePropertyOrientation {
  init(_ orientation: UIImage.Orientation) {
    switch orientation {
    case .up: self = .up
    case .down: self = .down
    case .left: self = .left
    case .right: self = .right
    case .upMirrored: self = .upMirrored
    case .downMirrored: self = .downMirrored
    case .leftMirrored: self = .leftMirrored
    case .rightMirrored: self = .rightMirrored
    @unknown default: self = .up
    }
  }
}
