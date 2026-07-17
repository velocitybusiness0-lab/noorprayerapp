// Shield Action — scanned by @bacons/apple-targets during prebuild.
module.exports = () => ({
  type: "shield-action",
  name: "ShieldAction",
  bundleIdentifier: "insiders.miraj.ShieldAction",
  deploymentTarget: "17.0",
  entitlements: {
    "com.apple.developer.family-controls": true,
    "com.apple.security.application-groups": ["group.insiders.miraj"],
  },
});
