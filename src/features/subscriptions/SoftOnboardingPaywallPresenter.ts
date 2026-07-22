import { OnboardingPaywallOutcome } from "./OnboardingPaywallOutcome";
import { subscriptionEntitlementStore } from "./SubscriptionEntitlementStore";

type ContinueHandler = (outcome: OnboardingPaywallOutcome) => void;

function applyEntitlement(outcome: OnboardingPaywallOutcome): void {
  if (
    outcome === "purchased" ||
    outcome === "restored" ||
    outcome === "feature_unlocked"
  ) {
    subscriptionEntitlementStore.markActive();
    return;
  }
  if (outcome === "try_for_free" || outcome === "unavailable") {
    subscriptionEntitlementStore.markTrial();
  }
}

/**
 * Soft path when Superwall is unavailable (missing native module / API keys).
 * Explicitly marks a local trial — no fake StoreKit purchase.
 */
export class SoftOnboardingPaywallPresenter {
  constructor(private readonly onContinue: ContinueHandler) {}

  async presentOnboardingPaywall(): Promise<OnboardingPaywallOutcome> {
    const outcome: OnboardingPaywallOutcome = "unavailable";
    applyEntitlement(outcome);
    this.onContinue(outcome);
    return outcome;
  }
}

export { applyEntitlement };
