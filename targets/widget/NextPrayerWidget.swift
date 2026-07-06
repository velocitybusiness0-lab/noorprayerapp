import WidgetKit
import SwiftUI

struct PrayerEntry: TimelineEntry {
    let date: Date
    let snapshot: PrayerSnapshot
}

/// Reloaded by the app (via ExtensionStorage.reloadWidget) whenever times change.
struct PrayerProvider: TimelineProvider {
    func placeholder(in context: Context) -> PrayerEntry {
        PrayerEntry(date: Date(), snapshot: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (PrayerEntry) -> Void) {
        completion(PrayerEntry(date: Date(), snapshot: PrayerSnapshot.load() ?? .placeholder))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerEntry>) -> Void) {
        let snapshot = PrayerSnapshot.load() ?? .placeholder
        let entry = PrayerEntry(date: Date(), snapshot: snapshot)
        // Refresh at the next prayer time so the "current" row advances.
        let refresh = max(snapshot.nextPrayerDate, Date().addingTimeInterval(600))
        completion(Timeline(entries: [entry], policy: .after(refresh)))
    }
}

struct NextPrayerWidget: Widget {
    let kind = "NextPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerProvider()) { entry in
            PrayerWidgetView(snapshot: entry.snapshot)
                .containerBackground(Color("widgetBackground"), for: .widget)
        }
        .configurationDisplayName("Prayer Times")
        .description("Your current and upcoming prayers at a glance.")
        .supportedFamilies([
            .systemSmall,
            .systemMedium,
            .accessoryRectangular,
            .accessoryInline,
        ])
    }
}
