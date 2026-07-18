import AVFoundation
import ExpoModulesCore

/** Captures back-camera preview frames without photo capture flashes. */
final class LiveScanCameraController: NSObject {
  private let session = AVCaptureSession()
  private let outputQueue = DispatchQueue(label: "miraj.live-scan.frames", qos: .userInitiated)
  private let videoOutput = AVCaptureVideoDataOutput()

  let previewLayer = AVCaptureVideoPreviewLayer()

  var onFrame: ((CVPixelBuffer) -> Void)?

  override init() {
    super.init()
    previewLayer.videoGravity = .resizeAspectFill
    previewLayer.session = session
    configureSession()
  }

  func start() {
    outputQueue.async { [weak self] in
      guard let self, !self.session.isRunning else { return }
      self.session.startRunning()
    }
  }

  func stop() {
    outputQueue.async { [weak self] in
      guard let self, self.session.isRunning else { return }
      self.session.stopRunning()
    }
  }

  private func configureSession() {
    session.beginConfiguration()
    session.sessionPreset = .high
    // Keep AlarmKit / in-app ringtone alive — default true steals AVAudioSession.
    session.automaticallyConfiguresApplicationAudioSession = false

    guard
      let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
      let input = try? AVCaptureDeviceInput(device: device),
      session.canAddInput(input)
    else {
      session.commitConfiguration()
      return
    }
    session.addInput(input)

    videoOutput.alwaysDiscardsLateVideoFrames = true
    videoOutput.videoSettings = [
      kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    ]
    videoOutput.setSampleBufferDelegate(self, queue: outputQueue)

    if session.canAddOutput(videoOutput) {
      session.addOutput(videoOutput)
      if let connection = videoOutput.connection(with: .video), connection.isVideoOrientationSupported {
        connection.videoOrientation = .portrait
      }
    }

    session.commitConfiguration()
  }
}

extension LiveScanCameraController: AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(
    _ output: AVCaptureOutput,
    didOutput sampleBuffer: CMSampleBuffer,
    from connection: AVCaptureConnection
  ) {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
    onFrame?(pixelBuffer)
  }
}
