/** Impact copy for the missed salah reveal step. */
export class OnboardingMissedImpactCopy {
  static headline(daily: number, yearly: number): string {
    if (daily <= 0) {
      return "You are still in control. Protect your consistency.";
    }
    if (daily === 1) {
      return `${yearly} prayers slipped away this year.`;
    }
    if (daily <= 3) {
      return `${yearly} namaz missed. That is not small.`;
    }
    return `${yearly} chances to reset with Allah — gone.`;
  }

  static punchline(daily: number, yearly: number): string {
    if (daily <= 0) {
      return "Every salah is still a fresh chance to come back.";
    }
    return `${yearly} namaz missed means ${yearly} duaa chances you've lost.`;
  }
}
