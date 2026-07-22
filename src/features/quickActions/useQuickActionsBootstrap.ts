import { useEffect } from "react";
import { useQuickActionRouting } from "expo-quick-actions/router";
import { quickActionsManager } from "./QuickActionsManager";

/** Registers shortcuts and routes `params.href` deep links from long-press. */
export function useQuickActionsBootstrap(): void {
  useQuickActionRouting();

  useEffect(() => {
    void quickActionsManager.register();
  }, []);
}
