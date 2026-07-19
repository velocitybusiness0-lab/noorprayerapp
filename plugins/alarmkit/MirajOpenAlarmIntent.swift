import AppIntents
import Foundation

/// Opens Miraj when AlarmKit stop or secondary (object hunt) is tapped.
@available(iOS 26.0, *)
struct MirajOpenAlarmIntent: LiveActivityIntent {
  static var title: LocalizedStringResource = "Open Miraj"
  static var description = IntentDescription("Opens Miraj from a prayer alarm action.")

  /// Prefer foreground launch so lock-screen / alert taps bring Miraj up.
  static var supportedModes: IntentModes { .foreground(.immediate) }
  static var openAppWhenRun: Bool = true

  @Parameter(title: "Alarm ID")
  var alarmID: String

  init() {
    self.alarmID = ""
  }

  init(alarmID: String) {
    self.alarmID = alarmID
  }

  func perform() async throws -> some IntentResult {
    .result()
  }
}
