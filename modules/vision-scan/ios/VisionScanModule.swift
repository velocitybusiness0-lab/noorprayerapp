import ExpoModulesCore



public class VisionScanModule: Module {

  private let pipeline = ScanDetectionPipeline()



  public func definition() -> ModuleDefinition {

    Name("VisionScan")



    Function("isSupported") {

      true

    }



    Function("hasCoreMLModel") {

      self.pipeline.hasCoreMLModel

    }



    Function("hasLiveCamera") {

      true

    }



    Function("detectionEngine") {

      if self.pipeline.hasCoreMLModel {

        return CoreMLModelProvider.shared.modelName ?? "coreml"

      }

      return "vision"

    }



    View(LiveScanCameraView.self) {

      Events("onDetections")

      Prop("active") { (view: LiveScanCameraView, active: Bool) in

        view.setActive(active)

      }

    }



    AsyncFunction("classifyImage") { (uri: String) async -> [[String: Any]] in

      self.pipeline.detect(uri: uri).detections

    }



    AsyncFunction("detectImage") { (uri: String) async -> [String: Any] in

      let result = self.pipeline.detect(uri: uri)

      return [

        "engine": result.engine,

        "detections": result.detections,

      ]

    }

  }

}
