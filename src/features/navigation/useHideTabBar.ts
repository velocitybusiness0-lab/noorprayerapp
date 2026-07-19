import { useLayoutEffect } from "react";
import { tabBarVisibilityRegistry } from "./TabBarVisibilityRegistry";

/** Hides the floating tab bar for the lifetime of the calling screen. */
export function useHideTabBar(reason: string): void {
  // useLayoutEffect: hide before paint so the bar cannot steal the first tap.
  useLayoutEffect(() => {
    tabBarVisibilityRegistry.hide(reason);
    return () => tabBarVisibilityRegistry.show(reason);
  }, [reason]);
}
