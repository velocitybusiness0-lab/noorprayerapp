const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const INTENT_MARKER = "mirajOpenAlarmIntent";
const METADATA_MARKER = "mirajAlarmMetadata";
const INTENT_FILE = "MirajOpenAlarmIntent.swift";
const METADATA_FILE = "MirajAlarmMetadata.swift";

/**
 * AlarmKit open-app wiring for Miraj.
 * react-native-ios-alarmkit hardcodes stopIntent/secondaryIntent to nil and
 * EmptyMetadata; this plugin injects LiveActivityIntents that launch Miraj on
 * stop (swipe/Open) + secondary into the Continue gate (`/alarm/ring`), and
 * binds MirajAlarmMetadata so the widget Live Activity can attach.
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

  copyPluginSwift(projectRoot, alarmKitIos, INTENT_FILE);
  copyPluginSwift(projectRoot, alarmKitIos, METADATA_FILE);
  syncIntentIntoWidget(projectRoot);
  patchHybridAlarmKit(hybridPath);
}

function copyPluginSwift(projectRoot, alarmKitIos, fileName) {
  const source = path.join(projectRoot, "plugins", "alarmkit", fileName);
  const dest = path.join(alarmKitIos, fileName);
  if (!fs.existsSync(source)) {
    throw new Error(`[withAlarmKitOpenAppIntents] Missing source: ${source}`);
  }
  fs.copyFileSync(source, dest);
}

function syncIntentIntoWidget(projectRoot) {
  const source = path.join(projectRoot, "plugins", "alarmkit", INTENT_FILE);
  const dest = path.join(projectRoot, "targets", "widget", INTENT_FILE);
  if (!fs.existsSync(source)) return;
  fs.copyFileSync(source, dest);
}

function patchHybridAlarmKit(hybridPath) {
  let contents = fs.readFileSync(hybridPath, "utf8");
  contents = ensureAppIntentsImport(contents);
  contents = patchIntentWiring(contents);
  contents = patchMetadataWiring(contents);
  fs.writeFileSync(hybridPath, contents);
}

function ensureAppIntentsImport(contents) {
  if (contents.includes("import AppIntents")) return contents;
  return contents.replace(
    "import Foundation\nimport NitroModules\nimport SwiftUI",
    "import Foundation\nimport AppIntents\nimport NitroModules\nimport SwiftUI"
  );
}

function patchIntentWiring(contents) {
  if (contents.includes(INTENT_MARKER)) return contents;

  contents = contents.replace(
    "let config = try self.parseConfiguration(configJson)",
    `let config = try self.parseConfiguration(configJson, alarmId: id) // ${INTENT_MARKER}`
  );

  contents = contents.replace(
    "private func parseConfiguration(_ json: String) throws -> AlarmManager.AlarmConfiguration<EmptyMetadata> {",
    `private func parseConfiguration(_ json: String, alarmId: String) throws -> AlarmManager.AlarmConfiguration<EmptyMetadata> { // ${INTENT_MARKER}`
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

  const openIntents = `      // ${INTENT_MARKER}: open Miraj on stop + secondary (Continue gate)
      let openIntent = MirajOpenAlarmIntent(alarmID: alarmId)
      let alarmConfig = AlarmManager.AlarmConfiguration(
        countdownDuration: countdownDuration,
        schedule: schedule,
        attributes: attributes,
        stopIntent: openIntent,
        secondaryIntent: MirajOpenAlarmIntent(alarmID: alarmId),
        sound: sound
      )`;

  if (!contents.includes(nilIntents) && !contents.includes(INTENT_MARKER)) {
    throw new Error(
      "[withAlarmKitOpenAppIntents] HybridAlarmKit.swift intent block not found; library may have changed."
    );
  }

  if (contents.includes(nilIntents)) {
    contents = contents.replace(nilIntents, openIntents);
  }
  return contents;
}

function patchMetadataWiring(contents) {
  if (contents.includes(METADATA_MARKER)) return contents;

  const emptyAttributes = `      // Create attributes with empty metadata
      let attributes = AlarmAttributes<EmptyMetadata>(
        presentation: presentation,
        metadata: EmptyMetadata(),
        tintColor: tintColor
      )`;

  const mirajAttributes = `      // ${METADATA_MARKER}: bind widget Live Activity + lock-screen Open
      let metadata = MirajAlarmMetadata(
        slot: config.metadata?["slot"],
        symbol: config.metadata?["symbol"],
        alarmId: config.metadata?["alarmId"] ?? alarmId,
        logicalId: config.metadata?["logicalId"],
        source: config.metadata?["source"]
      )
      let attributes = AlarmAttributes<MirajAlarmMetadata>(
        presentation: presentation,
        metadata: metadata,
        tintColor: tintColor
      )`;

  if (!contents.includes(emptyAttributes)) {
    throw new Error(
      "[withAlarmKitOpenAppIntents] HybridAlarmKit.swift EmptyMetadata attributes block not found."
    );
  }

  contents = contents.replace(emptyAttributes, mirajAttributes);
  contents = contents.replace(
    /AlarmManager\.AlarmConfiguration<EmptyMetadata>/g,
    `AlarmManager.AlarmConfiguration<MirajAlarmMetadata>`
  );
  return contents;
}

module.exports = withAlarmKitOpenAppIntents;
module.exports.applyAlarmKitOpenAppPatch = applyAlarmKitOpenAppPatch;
