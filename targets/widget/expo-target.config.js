// Built by @kingstinct/expo-apple-targets (invoked by react-native-device-activity),
// which scans ./targets/* for expo-target.config files.
module.exports = (config) => ({
  type: "widget",
  name: "NoorWidget",
  icon: "../../assets/images/icon.png",
  deploymentTarget: "16.4",
  frameworks: ["SwiftUI", "WidgetKit", "ActivityKit"],
  entitlements: {
    "com.apple.security.application-groups": ["group.com.noor.prayerapp"],
  },
  colors: {
    widgetBackground: { light: "#FFFFFF", dark: "#0B0B0C" },
    widgetForeground: { light: "#0B0B0C", dark: "#FFFFFF" },
  },
});
