const { withFinalizedMod, IOSConfig } = require("@expo/config-plugins");
const plist = require("@expo/plist").default ?? require("@expo/plist");
const fs = require("fs");

/** Removes push entitlement after all prebuild mods (runs last). */
function withStripLocalIosPushEntitlement(config) {
  return withFinalizedMod(config, [
    "ios",
    async (config) => {
      const entitlementsPath = IOSConfig.Entitlements.getEntitlementsPath(
        config.modRequest.projectRoot
      );
      if (!entitlementsPath || !fs.existsSync(entitlementsPath)) {
        return config;
      }

      const contents = fs.readFileSync(entitlementsPath, "utf8");
      const entitlements = plist.parse(contents);
      delete entitlements["aps-environment"];
      fs.writeFileSync(entitlementsPath, plist.build(entitlements));

      if (config.ios?.entitlements) {
        delete config.ios.entitlements["aps-environment"];
      }

      return config;
    },
  ]);
}

module.exports = withStripLocalIosPushEntitlement;
