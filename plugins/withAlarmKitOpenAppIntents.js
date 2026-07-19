const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const MARKER = "mirajOpenAlarmIntent";
const INTENT_FILE = "MirajOpenAlarmIntent.swift";

/**
 * AlarmKit open-app wiring for Miraj.
 * react-native-ios-alarmkit hardcodes stopIntent/secondaryIntent to nil;
 * this plugin injects LiveActivityIntents that launch Miraj on stop + secondary.
 */
function withAlarmKitOpenAppIntents(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      applyAlarmKitOpenAppPatch(config.modRequest.projectRoot);
      return config;
    },
  ]);
}

function applyAlarmKitOpenAppPatch(projectRoot) {
  const alarmKitIos = path.join(
    projectRoot,
    "node_modules",
    "react-native-ios-alarmkit",
    "ios"
  );
  const hybridPath = path.join(alarmKitIos, "HybridAlarmKit.swift");
  if (!fs.existsSync(hybridPath)) {
    console.warn(
      `[withAlarmKitOpenAppIntents] Missing ${hybridPath}; skip AlarmKit open-app patch.`
    );
    return;
  }

  copyIntentSource(projectRoot, alarmKitIos);
  patchHybridAlarmKit(hybridPath);
}

function copyIntentSource(projectRoot, alarmKitIos) {
  const source = path.join(
    projectRoot,
    "plugins",
    "alarmkit",
    INTENT_FILE
  );
  const dest = path.join(alarmKitIos, INTENT_FILE);
  if (!fs.existsSync(source)) {
    throw new Error(`[withAlarmKitOpenAppIntents] Missing intent source: ${source}`);
  }
  fs.copyFileSync(source, dest);
}

function patchHybridAlarmKit(hybridPath) {
  let contents = fs.readFileSync(hybridPath, "utf8");
  if (contents.includes(MARKER)) return;

  if (!contents.includes("import AppIntents")) {
    contents = contents.replace(
      "import Foundation\nimport NitroModules\nimport SwiftUI",
      "import Foundation\nimport AppIntents\nimport NitroModules\nimport SwiftUI"
    );
  }

  contents = contents.replace(
    "let config = try self.parseConfiguration(configJson)",
    `let config = try self.parseConfiguration(configJson, alarmId: id) // ${MARKER}`
  );

  contents = contents.replace(
    "private func parseConfiguration(_ json: String) throws -> AlarmManager.AlarmConfiguration<EmptyMetadata> {",
    `private func parseConfiguration(_ json: String, alarmId: String) throws -> AlarmManager.AlarmConfiguration<EmptyMetadata> { // ${MARKER}`
  );

  const nilIntents = `      // Create alarm configuration with all parameters
      let alarmConfig = AlarmManager.AlarmConfiguration(
        countdownDuration: countdownDuration,
        schedule: schedule,
        attributes: attributes,
        stopIntent: nil,
        secondaryIntent: nil,
        sound: sound
      )`;

  const openIntents = `      // ${MARKER}: open Miraj on stop + secondary (object hunt)
      let openIntent = MirajOpenAlarmIntent(alarmID: alarmId)
      let alarmConfig = AlarmManager.AlarmConfiguration(
        countdownDuration: countdownDuration,
        schedule: schedule,
        attributes: attributes,
        stopIntent: openIntent,
        secondaryIntent: MirajOpenAlarmIntent(alarmID: alarmId),
        sound: sound
      )`;

  if (!contents.includes(nilIntents)) {
    throw new Error(
      "[withAlarmKitOpenAppIntents] HybridAlarmKit.swift intent block not found; library may have changed."
    );
  }

  contents = contents.replace(nilIntents, openIntents);
  fs.writeFileSync(hybridPath, contents);
}

module.exports = withAlarmKitOpenAppIntents;
module.exports.applyAlarmKitOpenAppPatch = applyAlarmKitOpenAppPatch;
