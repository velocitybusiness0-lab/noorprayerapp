import * as QuickActions from "expo-quick-actions";
import { isExpoGo } from "@/core/runtime/isExpoGo";
import { QuickActionsCatalog } from "./QuickActionsCatalog";

/** Registers home-screen quick actions when the native module is available. */
export class QuickActionsManager {
  async register(): Promise<void> {
    if (isExpoGo()) return;
    try {
      const supported = await QuickActions.isSupported();
      if (!supported) return;
      await QuickActions.setItems(QuickActionsCatalog.items());
    } catch (error) {
      if (__DEV__) {
        console.warn("[QuickActionsManager] register failed", error);
      }
    }
  }
}

export const quickActionsManager = new QuickActionsManager();
