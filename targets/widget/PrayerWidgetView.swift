import WidgetKit
import SwiftUI

/// Chooses the right layout for each widget family. Black/white treatment
/// using the target's `widgetForeground` / `widgetBackground` colors.
struct PrayerWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let snapshot: PrayerSnapshot

    var body: some View {
        switch family {
        case .systemMedium: MediumPrayerView(snapshot: snapshot)
        case .accessoryInline: Text("\(snapshot.nextPrayer) \(nextTime)")
        case .accessoryRectangular: RectangularPrayerView(snapshot: snapshot)
        default: SmallPrayerView(snapshot: snapshot)
        }
    }

    private var nextTime: String {
        snapshot.prayers.first { $0.name == snapshot.nextPrayer }?.time ?? ""
    }
}

private var fg: Color { Color("widgetForeground") }

struct SmallPrayerView: View {
    let snapshot: PrayerSnapshot
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("NEXT").font(.caption2).foregroundStyle(fg.opacity(0.5))
            Text(snapshot.nextPrayer).font(.title2.bold()).foregroundStyle(fg)
            Text(snapshot.nextPrayerDate, style: .timer)
                .font(.system(.body, design: .rounded).monospacedDigit())
                .foregroundStyle(fg.opacity(0.8))
            Spacer(minLength: 0)
        }
        .padding(12)
    }
}

struct RectangularPrayerView: View {
    let snapshot: PrayerSnapshot
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(snapshot.nextPrayer).font(.headline)
                Text(snapshot.nextPrayerDate, style: .timer).monospacedDigit()
            }
            Spacer()
        }
    }
}

struct MediumPrayerView: View {
    let snapshot: PrayerSnapshot
    var body: some View {
        VStack(spacing: 10) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(snapshot.currentPrayer.uppercased())
                        .font(.caption).foregroundStyle(fg.opacity(0.5))
                    Text(snapshot.nextPrayerDate, style: .timer)
                        .font(.title2.monospacedDigit().bold())
                        .foregroundStyle(fg)
                }
                Spacer()
                Image(systemName: activeSymbol).font(.title2).foregroundStyle(fg)
            }
            HStack(spacing: 0) {
                ForEach(snapshot.prayers, id: \.self) { item in
                    VStack(spacing: 3) {
                        Image(systemName: item.symbol)
                            .font(.caption)
                            .foregroundStyle(item.active ? fg : fg.opacity(0.45))
                        Text(item.time).font(.caption2.monospacedDigit())
                            .foregroundStyle(item.active ? fg : fg.opacity(0.6))
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding(14)
    }

    private var activeSymbol: String {
        snapshot.prayers.first { $0.active }?.symbol ?? "moon.stars"
    }
}
