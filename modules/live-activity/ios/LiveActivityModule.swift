import ExpoModulesCore
import ActivityKit
import WidgetKit
import Foundation

private let liveActivityAppGroup = "group.insiders.miraj"
private let liveActivitySnapshotKey = "prayerSnapshot"

/// Bridges ActivityKit to JS so the app can run a prayer countdown Live
/// Activity, and shares the widget snapshot via the app group. All entry
/// points are guarded and degrade to no-ops when unavailable.
public class LiveActivityModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LiveActivity")

        Function("isSupported") { () -> Bool in
            if #available(iOS 16.4, *) {
                return ActivityAuthorizationInfo().areActivitiesEnabled
            }
            return false
        }

        // Writes the JSON snapshot the widget extension reads.
        Function("setSnapshot") { (json: String) in
            UserDefaults(suiteName: liveActivityAppGroup)?
                .set(json, forKey: liveActivitySnapshotKey)
        }

        Function("reloadWidgets") {
            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
        }

        AsyncFunction("start") { (title: String, prayerName: String, symbol: String, endEpoch: Double) -> String? in
            guard #available(iOS 16.4, *) else { return nil }
            guard ActivityAuthorizationInfo().areActivitiesEnabled else { return nil }

            let attributes = PrayerActivityAttributes(title: title)
            let state = PrayerActivityAttributes.ContentState(
                prayerName: prayerName,
                endDate: Date(timeIntervalSince1970: endEpoch),
                symbol: symbol
            )
            do {
                let activity = try Activity.request(
                    attributes: attributes,
                    content: .init(state: state, staleDate: nil)
                )
                return activity.id
            } catch {
                return nil
            }
        }

        AsyncFunction("update") { (id: String, prayerName: String, symbol: String, endEpoch: Double) in
            guard #available(iOS 16.4, *) else { return }
            let state = PrayerActivityAttributes.ContentState(
                prayerName: prayerName,
                endDate: Date(timeIntervalSince1970: endEpoch),
                symbol: symbol
            )
            for activity in Activity<PrayerActivityAttributes>.activities where activity.id == id {
                await activity.update(.init(state: state, staleDate: nil))
            }
        }

        AsyncFunction("endAll") {
            guard #available(iOS 16.4, *) else { return }
            for activity in Activity<PrayerActivityAttributes>.activities {
                await activity.end(nil, dismissalPolicy: .immediate)
            }
        }
    }
}
