import ActivityKit
import Foundation

/// Shared Live Activity contract. The same file is compiled into the app
/// (via the local live-activity module) and the widget extension so both
/// sides agree on the schema.
struct PrayerActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        /// Prayer currently counting down to.
        var prayerName: String
        /// When the countdown ends.
        var endDate: Date
        /// SF Symbol for the prayer phase.
        var symbol: String
    }

    /// Static label shown for the whole activity session.
    var title: String
}
