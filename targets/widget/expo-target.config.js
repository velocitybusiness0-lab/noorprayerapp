// Widget extension — scanned by @bacons/apple-targets during prebuild.
module.exports = (config) => ({
  type: "widget",
  name: "Widget",
  bundleIdentifier: "insiders.miraj.Widget",
  icon: "../../assets/images/icon.png",
  deploymentTarget: "17.0",
  frameworks: ["SwiftUI", "WidgetKit", "ActivityKit"],
  entitlements: {
    "com.apple.security.application-groups": ["group.insiders.miraj"],
  },
  colors: {
    widgetBackground: { light: "#FFFFFF", dark: "#0B0B0C" },
    widgetForeground: { light: "#0B0B0C", dark: "#FFFFFF" },
  },
});
