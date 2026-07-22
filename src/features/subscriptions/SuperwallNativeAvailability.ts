import { requireOptionalNativeModule } from "expo";

/**
 * Probes whether the SuperwallExpo native module is linked in the running binary.
 * Prefer this over Expo Go checks — a stale development client is not Expo Go
 * but still lacks the module until an EAS / `expo run:*` rebuild.
 */
export class SuperwallNativeAvailability {
  private static cached: boolean | null = null;

  static readonly nativeModuleName = "SuperwallExpo";

  static isLinked(): boolean {
    if (this.cached == null) {
      this.cached =
        requireOptionalNativeModule(this.nativeModuleName) != null;
    }
    return this.cached;
  }

  /** Dev-only hint when keys exist but the binary was built without Superwall. */
  static warnIfRebuildRequired(hasUsableKey: boolean): void {
    if (!__DEV__ || !hasUsableKey || this.isLinked()) return;
    console.warn(
      "[Superwall] Native module 'SuperwallExpo' is missing. " +
        "Soft paywalls / try-for-free will run until you rebuild " +
        "(EAS development build or `npx expo run:ios` / `run:android`)."
    );
  }
}
