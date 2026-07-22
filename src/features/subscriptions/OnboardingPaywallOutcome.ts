/** Result of presenting an onboarding Superwall placement. */
export type OnboardingPaywallOutcome =
  | "purchased"
  | "restored"
  | "feature_unlocked"
  | "try_for_free"
  | "declined"
  | "unavailable"
  | "error";

export class OnboardingPaywallOutcomePolicy {
  /** Outcomes that should continue into permission onboarding. */
  static shouldContinueToPermissions(outcome: OnboardingPaywallOutcome): boolean {
    return (
      outcome === "purchased" ||
      outcome === "restored" ||
      outcome === "feature_unlocked" ||
      outcome === "try_for_free" ||
      outcome === "unavailable"
    );
  }
}
