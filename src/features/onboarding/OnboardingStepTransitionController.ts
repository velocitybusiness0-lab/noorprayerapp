/**
 * Tracks whether displayed step content should swap immediately or via transition.
 * Keeps pending step identity so rapid advances land on the latest page.
 */
export class OnboardingStepTransitionController {
  private displayedKey: string;
  private pendingKey: string;
  private transitioning = false;

  constructor(initialKey: string) {
    this.displayedKey = initialKey;
    this.pendingKey = initialKey;
  }

  getDisplayedKey(): string {
    return this.displayedKey;
  }

  isTransitioning(): boolean {
    return this.transitioning;
  }

  /** Returns true when an exit animation should start for a new step. */
  shouldBeginTransition(nextKey: string): boolean {
    if (nextKey === this.displayedKey && nextKey === this.pendingKey) {
      return false;
    }
    this.pendingKey = nextKey;
    if (this.transitioning) return false;
    if (nextKey === this.displayedKey) return false;
    this.transitioning = true;
    return true;
  }

  /** Applies the pending key after exit; returns the key now displayed. */
  commitPendingKey(): string {
    this.displayedKey = this.pendingKey;
    return this.displayedKey;
  }

  /** Ends enter; returns true if another exit must start for a newer pending key. */
  finishEnter(): boolean {
    this.transitioning = false;
    if (this.pendingKey === this.displayedKey) return false;
    this.transitioning = true;
    return true;
  }
}
