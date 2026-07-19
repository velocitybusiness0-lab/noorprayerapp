const HIDDEN_ROUTE_TOKENS = new Set([
  "onboarding",
  "scan",
  "alarm",
  "ring",
]);

interface TabBarVisibilityInput {
  registryHidden: boolean;
  pathname: string | null;
  segments: readonly string[];
  activeRouteNames: readonly string[];
}

/**
 * Decides when the floating tab bar must not render or receive touches.
 * Uses registry, URL segments, and the focused native route chain so modals
 * still hide the bar when pathname lags behind presentation.
 */
export class TabBarVisibilityPolicy {
  static shouldHide(input: TabBarVisibilityInput): boolean {
    if (input.registryHidden) return true;

    if (input.segments.some((segment) => HIDDEN_ROUTE_TOKENS.has(segment))) {
      return true;
    }

    if (input.activeRouteNames.some((name) => HIDDEN_ROUTE_TOKENS.has(name))) {
      return true;
    }

    if (!input.pathname) return false;

    return (
      input.pathname.includes("onboarding") ||
      input.pathname.includes("/scan") ||
      input.pathname.includes("/alarm")
    );
  }

  /** Walks the focused branch of a navigation state tree. */
  static activeRouteNames(state: { routes?: readonly { name: string; state?: unknown }[]; index?: number } | undefined): string[] {
    const names: string[] = [];
    let current: typeof state = state;

    while (current?.routes?.length) {
      const route = current.routes[current.index ?? 0];
      if (!route) break;
      names.push(route.name);
      current = route.state as typeof state;
    }

    return names;
  }
}
