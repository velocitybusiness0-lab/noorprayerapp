import ActivityKit
import AlarmKit
import AppIntents
import SwiftUI
import WidgetKit

/// AlarmKit Live Activity — lock screen + Dynamic Island countdown / alert UI.
/// Open control uses MirajOpenAlarmIntent → Continue gate (`/alarm/ring`).
@available(iOS 26.0, *)
struct AlarmLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: AlarmAttributes<MirajAlarmMetadata>.self) { context in
            AlarmLockScreenView(context: context)
                .padding(16)
                .activityBackgroundTint(Color.black.opacity(0.85))
                .activitySystemActionForegroundColor(.white)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Image(systemName: MirajAlarmSymbol.name(for: context.attributes.metadata))
                        .foregroundStyle(.white)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    AlarmCountdownText(state: context.state)
                        .monospacedDigit()
                        .frame(maxWidth: 64)
                }
                DynamicIslandExpandedRegion(.center) {
                    Text(context.attributes.presentation.alert.title)
                        .font(.headline)
                        .lineLimit(1)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    AlarmLiveActivityOpenControl(alarmID: AlarmLiveActivityAlarmID.resolve(context))
                }
            } compactLeading: {
                Image(systemName: MirajAlarmSymbol.name(for: context.attributes.metadata))
            } compactTrailing: {
                AlarmCountdownText(state: context.state)
                    .monospacedDigit()
                    .frame(maxWidth: 44)
            } minimal: {
                Image(systemName: MirajAlarmSymbol.name(for: context.attributes.metadata))
            }
        }
    }
}

@available(iOS 26.0, *)
private struct AlarmCountdownText: View {
    let state: AlarmPresentationState

    var body: some View {
        switch state.mode {
        case .countdown(let info):
            Text(info.fireDate, style: .timer)
        case .paused(let info):
            let remaining = info.totalCountdownDuration - info.previouslyElapsedDuration
            Text(Duration.seconds(remaining), format: .time(pattern: .minuteSecond))
        case .alert(let info):
            Text("\(info.time.hour):\(String(format: "%02d", info.time.minute))")
        @unknown default:
            Text("--:--")
        }
    }
}

@available(iOS 26.0, *)
private struct AlarmLockScreenView: View {
    let context: ActivityViewContext<AlarmAttributes<MirajAlarmMetadata>>

    var body: some View {
        let alarmID = AlarmLiveActivityAlarmID.resolve(context)
        HStack(spacing: 14) {
            Image(systemName: MirajAlarmSymbol.name(for: context.attributes.metadata))
                .font(.title2)
                .foregroundStyle(.white)
            VStack(alignment: .leading, spacing: 2) {
                Text("PRAYER ALARM")
                    .font(.caption2)
                    .foregroundStyle(.white.opacity(0.6))
                Text(context.attributes.presentation.alert.title)
                    .font(.headline)
                    .foregroundStyle(.white)
                    .lineLimit(1)
                if case .paused = context.state.mode {
                    Text("Paused")
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.6))
                }
            }
            Spacer()
            AlarmLiveActivityOpenControl(alarmID: alarmID)
        }
    }
}
