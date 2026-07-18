import { useEffect } from "react";
import { tabBarVisibilityRegistry } from "./TabBarVisibilityRegistry";

/** Hides the floating tab bar for the lifetime of the calling screen. */
export function useHideTabBar(reason: string): void {
  useEffect(() => {
    tabBarVisibilityRegistry.hide(reason);
    return () => tabBarVisibilityRegistry.show(reason);
  }, [reason]);
}
