import AppIntents
import Foundation

#if canImport(UIKit)
import UIKit
#endif

/// App Group keys for lock-screen → Continue-gate handoff into Miraj JS.
enum MirajAlarmObjectHuntLaunchKeys {
  static let appGroupId = "group.insiders.miraj"
  static let alarmId = "miraj.pendingObjectHunt.alarmId"
  static let launchedAt = "miraj.pendingObjectHunt.at"
}

/// Persists the AlarmKit id so JS can open the Continue gate after a cold start.
enum MirajAlarmObjectHuntLaunchStore {
  static func remember(alarmID: String) {
    guard !alarmID.isEmpty,
          let defaults = UserDefaults(suiteName: MirajAlarmObjectHuntLaunchKeys.appGroupId)
    else { return }
    defaults.set(alarmID, forKey: MirajAlarmObjectHuntLaunchKeys.alarmId)
    defaults.set(Date().timeIntervalSince1970, forKey: MirajAlarmObjectHuntLaunchKeys.launchedAt)
  }
}

/// Opens Miraj when AlarmKit stop (Open / swipe) or secondary is tapped,
/// and deep-links into the Continue gate (`/alarm/ring`). Object hunt starts
/// only after the user taps Continue in-app.
@available(iOS 26.0, *)
struct MirajOpenAlarmIntent: LiveActivityIntent {
  static var title: LocalizedStringResource = "Open Miraj"
  static var description = IntentDescription(
    "Opens Miraj to the alarm Continue screen from a prayer alarm action."
  )

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
    MirajAlarmObjectHuntLaunchStore.remember(alarmID: alarmID)
    await openContinueGateDeepLinkIfPossible(alarmID: alarmID)
    return .result()
  }

  /// Best-effort deep link when running in the app process. App Group handoff
  /// remains the reliable path for cold start / widget extension.
  @MainActor
  private func openContinueGateDeepLinkIfPossible(alarmID: String) async {
    guard !alarmID.isEmpty else { return }
    #if canImport(UIKit)
    var components = URLComponents()
    components.scheme = "miraj"
    components.host = "alarm"
    components.path = "/ring"
    components.queryItems = [URLQueryItem(name: "alarmId", value: alarmID)]
    guard let url = components.url else { return }
    await UIApplication.shared.open(url, options: [:])
    #endif
  }
}
