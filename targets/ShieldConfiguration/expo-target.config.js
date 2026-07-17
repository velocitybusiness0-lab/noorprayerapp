// Shield Configuration — bacons type is "shield-config" (not shield-configuration).
module.exports = () => ({
  type: "shield-config",
  name: "ShieldConfiguration",
  bundleIdentifier: "insiders.miraj.ShieldConfiguration",
  deploymentTarget: "17.0",
  entitlements: {
    "com.apple.developer.family-controls": true,
    "com.apple.security.application-groups": ["group.insiders.miraj"],
  },
});
