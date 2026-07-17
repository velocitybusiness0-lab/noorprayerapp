import ActivityKit
import Foundation

/// App-side copy of the Live Activity contract. Must stay in sync with the
/// widget extension's `PrayerActivityAttributes` (ActivityKit requires the
/// same schema to be compiled into both targets).
struct PrayerActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var prayerName: String
        var endDate: Date
        var symbol: String
    }

    var title: String
}
