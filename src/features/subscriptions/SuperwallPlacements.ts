/**
 * Placement names must match the Superwall dashboard campaigns.
 * Configure products / free-trial offers there — do not invent billing here.
 */
export class SuperwallPlacements {
  /** Shown after personalized plan “Start my plan”. */
  static readonly onboardingPaywall = "onboarding_paywall";

  /** Free-trial / limited-access path from quick action / deep link. */
  static readonly tryForFree = "try_for_free";

  /** Lifetime upgrade from Settings. */
  static readonly upgradeToLifetime = "upgrade_to_lifetime";

  static readonly all = [
    SuperwallPlacements.onboardingPaywall,
    SuperwallPlacements.tryForFree,
    SuperwallPlacements.upgradeToLifetime,
  ] as const;
}
