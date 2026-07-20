import AlarmKit

/// Custom AlarmKit metadata passed from JS (`AlarmConfigurationBuilder`).
/// Must stay in sync with `targets/widget/MirajAlarmMetadata.swift` so the
/// widget Live Activity binds to the same attributes type.
struct MirajAlarmMetadata: AlarmMetadata, Codable {
  var slot: String?
  var symbol: String?
  var alarmId: String?
  var logicalId: String?
  var source: String?
}

enum MirajAlarmSymbol {
  static func name(for metadata: MirajAlarmMetadata?) -> String {
    if let symbol = metadata?.symbol, !symbol.isEmpty { return symbol }
    switch metadata?.slot {
    case "fajr": return "sunrise"
    case "sunrise": return "sun.horizon"
    case "dhuhr": return "sun.max"
    case "asr": return "sun.min"
    case "maghrib": return "sunset"
    case "isha": return "moon.stars"
    default: return "alarm"
    }
  }
}
