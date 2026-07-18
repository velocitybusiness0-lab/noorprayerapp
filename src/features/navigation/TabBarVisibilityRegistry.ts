type Listener = () => void;

/**
 * Lets full-screen flows (onboarding, scan, alarm) hide the floating tab bar
 * even when pathname still reports the tabs route under a modal.
 */
class TabBarVisibilityRegistry {
  private hiddenReasons = new Set<string>();
  private listeners = new Set<Listener>();

  hide(reason: string): void {
    if (this.hiddenReasons.has(reason)) return;
    this.hiddenReasons.add(reason);
    this.emit();
  }

  show(reason: string): void {
    if (!this.hiddenReasons.delete(reason)) return;
    this.emit();
  }

  isHidden(): boolean {
    return this.hiddenReasons.size > 0;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

export const tabBarVisibilityRegistry = new TabBarVisibilityRegistry();
