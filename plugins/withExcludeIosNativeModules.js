const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const IOS_ONLY_NATIVE_MODULES = [
  "react-native-ios-alarmkit",
];

/**
 * Ensures iOS-only native modules are excluded from Android Gradle autolinking.
 * package.json exclude + react-native.config.js are not always enough for Nitro modules.
 */
function withExcludeIosNativeModules(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const settingsGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        "settings.gradle"
      );
      if (!fs.existsSync(settingsGradlePath)) return config;

      let contents = fs.readFileSync(settingsGradlePath, "utf8");
      if (contents.includes("mirajExcludeIosNativeModules")) return config;

      const excludeLine = `expoAutolinking.exclude = ${JSON.stringify(IOS_ONLY_NATIVE_MODULES)} // mirajExcludeIosNativeModules`;

      if (contents.includes("expoAutolinking.useExpoModules()")) {
        contents = contents.replace(
          "expoAutolinking.useExpoModules()",
          `${excludeLine}\n  expoAutolinking.useExpoModules()`
        );
      } else if (contents.includes("useExpoModules()")) {
        contents = contents.replace(
          "useExpoModules()",
          `${excludeLine}\n  useExpoModules()`
        );
      } else {
        contents += `\n${excludeLine}\n`;
      }

      fs.writeFileSync(settingsGradlePath, contents);
      return config;
    },
  ]);
}

module.exports = withExcludeIosNativeModules;
