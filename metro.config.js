const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ignore any stale nested scaffold so Metro never hits duplicate modules.
config.resolver.blockList = [/[/\\]prayer-app[/\\].*/];

module.exports = config;
