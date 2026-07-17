import WidgetKit
import SwiftUI

@main
struct MirajWidgetBundle: WidgetBundle {
    var body: some Widget {
        NextPrayerWidget()
        PrayerLiveActivity()
        if #available(iOS 26.0, *) {
            AlarmLiveActivity()
        }
    }
}
