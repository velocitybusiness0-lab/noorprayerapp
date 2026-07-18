import { Href, router } from "expo-router";

const DEFAULT_FALLBACK: Href = "/(tabs)";

/**
 * Pops one screen when history exists; otherwise replaces with a safe route.
 * Prefer this over always replacing — replace jumps past prior screens.
 */
export class StackBackNavigator {
  goBack(fallback: Href = DEFAULT_FALLBACK): void {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(fallback);
  }
}

export const stackBackNavigator = new StackBackNavigator();
