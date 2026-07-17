const { createRunOncePlugin } = require("expo/config-plugins");
const withCopyTargetFolder = require("react-native-device-activity/config-plugin/withCopyTargetFolder");
const withEntitlementsPlugin = require("react-native-device-activity/config-plugin/withEntitlements");
const withInfoPlistAppGroup = require("react-native-device-activity/config-plugin/withInfoPlistAppGroup");
const withXcodeSettings = require("react-native-device-activity/config-plugin/withXCodeSettings");

/**
 * Screen Time entitlements + app-group wiring for react-native-device-activity.
 * Intentionally skips @kingstinct/expo-apple-targets scanning — targets are owned
 * by @bacons/apple-targets so the widget and Screen Time extensions don't double-register.
 */
function withIosScreenTime(config, props = {}) {
  const appGroup = props.appGroup;
  if (!appGroup) {
    throw new Error("'appGroup' is required for withIosScreenTime");
  }

  const options = {
    appleTeamId: props.appleTeamId,
    appGroup,
    // Keep committed targets/ Swift + bacons expo-target.config.js files.
    copyToTargetFolder: false,
  };

  return withXcodeSettings(
    withInfoPlistAppGroup(withEntitlementsPlugin(withCopyTargetFolder(config, options), options), options),
    options
  );
}

module.exports = createRunOncePlugin(withIosScreenTime, "withIosScreenTime", "1.0.0");
