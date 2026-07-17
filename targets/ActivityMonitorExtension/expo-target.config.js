// Device Activity Monitor — scanned by @bacons/apple-targets during prebuild.
module.exports = () => ({
  type: "device-activity-monitor",
  name: "ActivityMonitorExtension",
  bundleIdentifier: "insiders.miraj.ActivityMonitorExtension",
  deploymentTarget: "17.0",
  entitlements: {
    "com.apple.developer.family-controls": true,
    "com.apple.security.application-groups": ["group.insiders.miraj"],
  },
});
