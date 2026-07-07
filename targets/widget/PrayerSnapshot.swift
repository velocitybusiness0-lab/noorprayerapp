import Foundation

/// App group shared with the main app; JS writes the snapshot here.
let appGroupId = "group.insiders.miraj"
let snapshotKey = "prayerSnapshot"

/// One prayer row shown in the widget.
struct PrayerItem: Codable, Hashable {
    let name: String
    let time: String
    let active: Bool
    /// SF Symbol name for the prayer phase.
    let symbol: String
}

/// Full snapshot the app publishes for widgets + live activity.
struct PrayerSnapshot: Codable {
    let currentPrayer: String
    let nextPrayer: String
    /// Epoch seconds when the next prayer begins (for countdowns).
    let nextPrayerEpoch: Double
    let prayers: [PrayerItem]

    var nextPrayerDate: Date {
        Date(timeIntervalSince1970: nextPrayerEpoch)
    }

    /// Reads and decodes the latest snapshot written by the app, if any.
    static func load() -> PrayerSnapshot? {
        guard
            let defaults = UserDefaults(suiteName: appGroupId),
            let raw = defaults.string(forKey: snapshotKey),
            let data = raw.data(using: .utf8)
        else { return nil }
        return try? JSONDecoder().decode(PrayerSnapshot.self, from: data)
    }

    static var placeholder: PrayerSnapshot {
        PrayerSnapshot(
            currentPrayer: "Dhuhr",
            nextPrayer: "Asr",
            nextPrayerEpoch: Date().addingTimeInterval(3600).timeIntervalSince1970,
            prayers: [
                PrayerItem(name: "Fajr", time: "05:12", active: false, symbol: "sunrise"),
                PrayerItem(name: "Dhuhr", time: "13:04", active: true, symbol: "sun.max"),
                PrayerItem(name: "Asr", time: "16:41", active: false, symbol: "sun.min"),
                PrayerItem(name: "Maghrib", time: "19:58", active: false, symbol: "sunset"),
                PrayerItem(name: "Isha", time: "21:20", active: false, symbol: "moon.stars"),
            ]
        )
    }
}
