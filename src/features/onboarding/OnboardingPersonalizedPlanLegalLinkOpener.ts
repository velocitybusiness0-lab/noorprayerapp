import { Linking } from "react-native";
import { AppLinks } from "@/core/app/AppLinks";

/** Opens Terms / Privacy URLs; Restore is a no-op stub until billing restore exists. */
export class OnboardingPersonalizedPlanLegalLinkOpener {
  static openTerms(): void {
    void Linking.openURL(AppLinks.termsUrl);
  }

  static openPrivacy(): void {
    void Linking.openURL(AppLinks.privacyUrl);
  }

  static restorePurchases(): void {
    // Stub until StoreKit / Play Billing restore is wired.
  }
}
