/**
 * Disable autolinking for iOS-only native modules on Android builds.
 * These packages are required at runtime on iOS but must not compile on Android.
 */
module.exports = {
  dependencies: {
    "react-native-ios-alarmkit": {
      platforms: {
        android: null,
      },
    },
  },
};
