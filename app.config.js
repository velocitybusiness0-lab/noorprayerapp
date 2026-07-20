const base = require("./app.json").expo;

/** EAS profiles that keep Screen Time extensions (Family Controls signing required). */
const SCREEN_TIME_PROFILES = new Set([
  "development-with-screen-time",
  "preview-with-screen-time",
  "production-with-screen-time",
]);

/** Local Xcode automatic signing — main Miraj app only (no extensions / special entitlements). */
function isLocalMainAppOnlyInstall() {
  if (process.env.LOCAL_IOS_DEV === "1") {
    return true;
  }
  // `expo run:ios` / local prebuild with development profile — not EAS cloud.
  return (
    process.env.EAS_BUILD_PROFILE === "development" && !process.env.EAS_BUILD
  );
}

function stripScreenTimeFromConfig(config) {
  if (config.ios?.entitlements) {
    delete config.ios.entitlements["com.apple.developer.family-controls"];
  }

  config.plugins = config.plugins
    .map((plugin) => {
      if (Array.isArray(plugin) && plugin[0] === "./plugins/withIosScreenTime.js") {
        return null;
      }
      return plugin;
    })
    .filter(Boolean);

  return config;
}

function stripWidgetFromConfig(config) {
  config.plugins = config.plugins
    .map((plugin) => {
      if (plugin === "@bacons/apple-targets") {
        return null;
      }
      if (Array.isArray(plugin) && plugin[0] === "@bacons/apple-targets") {
        return null;
      }
      return plugin;
    })
    .filter(Boolean);

  if (config.ios?.entitlements) {
    delete config.ios.entitlements["com.apple.security.application-groups"];
  }

  config.extra = config.extra ?? {};
  config.extra.eas = config.extra.eas ?? {};
  config.extra.eas.build = config.extra.eas.build ?? {};
  config.extra.eas.build.experimental = config.extra.eas.build.experimental ?? {};
  config.extra.eas.build.experimental.ios = config.extra.eas.build.experimental.ios ?? {};
  config.extra.eas.build.experimental.ios.appExtensions = [];

  return config;
}

function stripPushEntitlementForLocalDev(config) {
  if (config.ios?.entitlements) {
    delete config.ios.entitlements["aps-environment"];
  }

  config.plugins = config.plugins
    .map((plugin) => {
      if (Array.isArray(plugin) && plugin[0] === "expo-notifications") {
        return null;
      }
      if (plugin === "expo-notifications") {
        return null;
      }
      return plugin;
    })
    .filter(Boolean);

  config.plugins.push("./plugins/withStripLocalIosPushEntitlement.js");

  if (config.ios?.infoPlist?.UIBackgroundModes) {
    config.ios.infoPlist.UIBackgroundModes = config.ios.infoPlist.UIBackgroundModes.filter(
      (mode) => mode !== "remote-notification"
    );
  }

  return config;
}

/** EAS development / preview / production — Screen Time off, widget kept for credentials. */
function stripScreenTimeExtensions(config) {
  const result = stripScreenTimeFromConfig(structuredClone(config));

  result.plugins = result.plugins.map((plugin) => {
    if (plugin === "@bacons/apple-targets") {
      return ["@bacons/apple-targets", { match: "widget" }];
    }
    return plugin;
  });

  result.extra = result.extra ?? {};
  result.extra.eas = result.extra.eas ?? {};
  result.extra.eas.build = result.extra.eas.build ?? {};
  result.extra.eas.build.experimental = result.extra.eas.build.experimental ?? {};
  result.extra.eas.build.experimental.ios = result.extra.eas.build.experimental.ios ?? {};
  result.extra.eas.build.experimental.ios.appExtensions = [
    {
      bundleIdentifier: "insiders.miraj.Widget",
      targetName: "Widget",
      entitlements: {
        "com.apple.security.application-groups": ["group.insiders.miraj"],
      },
    },
  ];

  return result;
}

/** Local device install — main app only, standard automatic signing. */
function stripForLocalMainAppOnly(config) {
  let result = stripScreenTimeFromConfig(structuredClone(config));
  result = stripWidgetFromConfig(result);
  result = stripPushEntitlementForLocalDev(result);
  return result;
}

/**
 * Dynamic Expo config.
 *
 * EAS sets EAS_BUILD_PROFILE during builds. All profiles omit Screen Time
 * extensions by default so Ad Hoc / internal signing succeeds without Family
 * Controls provisioning. Opt in via *-with-screen-time profiles when ready.
 *
 * LOCAL_IOS_DEV=1 (or development profile outside EAS cloud) strips widget +
 * app-group + push entitlements so `expo run:ios --device` works with Xcode
 * automatic signing.
 */
module.exports = () => {
  const config = structuredClone(base);
  const profile = process.env.EAS_BUILD_PROFILE;

  if (isLocalMainAppOnlyInstall()) {
    return stripForLocalMainAppOnly(config);
  }

  // Local prebuild (no profile): keep committed targets/ for native dev on Mac.
  if (!profile || SCREEN_TIME_PROFILES.has(profile)) {
    return config;
  }

  return stripScreenTimeExtensions(config);
};
