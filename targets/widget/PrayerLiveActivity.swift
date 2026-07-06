import ActivityKit
import WidgetKit
import SwiftUI

/// Live Activity for the running prayer countdown: lock-screen banner plus
/// the three Dynamic Island presentations.
struct PrayerLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: PrayerActivityAttributes.self) { context in
            LockScreenLiveActivityView(context: context)
                .padding(16)
                .activityBackgroundTint(Color.black.opacity(0.85))
                .activitySystemActionForegroundColor(.white)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Image(systemName: context.state.symbol).foregroundStyle(.white)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text(context.state.endDate, style: .timer)
                        .monospacedDigit().frame(maxWidth: 64)
                }
                DynamicIslandExpandedRegion(.center) {
                    Text(context.state.prayerName).font(.headline)
                }
            } compactLeading: {
                Image(systemName: context.state.symbol)
            } compactTrailing: {
                Text(context.state.endDate, style: .timer).monospacedDigit().frame(maxWidth: 44)
            } minimal: {
                Image(systemName: context.state.symbol)
            }
        }
    }
}

struct LockScreenLiveActivityView: View {
    let context: ActivityContext<PrayerActivityAttributes>

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: context.state.symbol)
                .font(.title2).foregroundStyle(.white)
            VStack(alignment: .leading, spacing: 2) {
                Text(context.attributes.title.uppercased())
                    .font(.caption2).foregroundStyle(.white.opacity(0.6))
                Text(context.state.prayerName).font(.headline).foregroundStyle(.white)
            }
            Spacer()
            Text(context.state.endDate, style: .timer)
                .font(.title3.monospacedDigit().bold())
                .foregroundStyle(.white)
        }
    }
}

typealias ActivityContext<T: ActivityAttributes> = ActivityViewContext<T>
