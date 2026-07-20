import ActivityKit
import AlarmKit
import AppIntents
import SwiftUI

/// Resolves the AlarmKit UUID for lock-screen / Dynamic Island Open actions.
@available(iOS 26.0, *)
enum AlarmLiveActivityAlarmID {
  static func resolve(
    _ context: ActivityViewContext<AlarmAttributes<MirajAlarmMetadata>>
  ) -> String {
    let fromMeta = context.attributes.metadata.alarmId ?? ""
    if !fromMeta.isEmpty { return fromMeta }
    return context.state.alarmID.uuidString
  }
}

/// Lock-screen / Island control that opens Miraj to the Continue gate.
@available(iOS 26.0, *)
struct AlarmLiveActivityOpenControl: View {
  let alarmID: String

  var body: some View {
    Button(intent: MirajOpenAlarmIntent(alarmID: alarmID)) {
      Label("Open", systemImage: "arrow.up.forward.app")
        .font(.subheadline.weight(.semibold))
        .foregroundStyle(.white)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color.white.opacity(0.18), in: Capsule())
    }
    .buttonStyle(.plain)
  }
}
