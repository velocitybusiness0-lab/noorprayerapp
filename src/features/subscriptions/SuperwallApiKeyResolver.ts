import Constants from "expo-constants";
import { Platform } from "react-native";

export interface SuperwallApiKeys {
  ios?: string;
  android?: string;
}

/**
 * Resolves Superwall API keys from Expo public env vars, then app.json `extra`.
 * Never hardcodes a production secret — put real keys in EAS secrets / `.env`.
 */
export class SuperwallApiKeyResolver {
  private static readonly placeholderTokens = new Set([
    "",
    "pk_replace_me",
    "YOUR_SUPERWALL_API_KEY",
    "YOUR_IOS_API_KEY",
    "YOUR_ANDROID_API_KEY",
  ]);

  static resolve(): SuperwallApiKeys {
    const extra = Constants.expoConfig?.extra as
      | { superwallIosApiKey?: string; superwallAndroidApiKey?: string }
      | undefined;

    return {
      ios: this.sanitize(
        process.env.EXPO_PUBLIC_SUPERWALL_IOS_API_KEY ?? extra?.superwallIosApiKey
      ),
      android: this.sanitize(
        process.env.EXPO_PUBLIC_SUPERWALL_ANDROID_API_KEY ??
          extra?.superwallAndroidApiKey
      ),
    };
  }

  static keyForPlatform(keys: SuperwallApiKeys = this.resolve()): string | null {
    const key = Platform.OS === "ios" ? keys.ios : keys.android;
    return key ?? null;
  }

  static hasUsableKey(keys: SuperwallApiKeys = this.resolve()): boolean {
    return this.keyForPlatform(keys) != null;
  }

  private static sanitize(value: string | undefined): string | undefined {
    if (value == null) return undefined;
    const trimmed = value.trim();
    if (this.placeholderTokens.has(trimmed)) return undefined;
    return trimmed;
  }
}
