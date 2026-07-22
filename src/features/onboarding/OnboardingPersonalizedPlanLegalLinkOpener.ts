import { Linking } from "react-native";
import { AppLinks } from "@/core/app/AppLinks";
import { superwallManager } from "@/features/subscriptions/SuperwallManager";

/** Opens Terms / Privacy URLs; Restore uses Superwall when available. */
export class OnboardingPersonalizedPlanLegalLinkOpener {
  static openTerms(): void {
    void Linking.openURL(AppLinks.termsUrl);
  }

  static openPrivacy(): void {
    void Linking.openURL(AppLinks.privacyUrl);
  }

  static restorePurchases(): void {
    void superwallManager.restorePurchases();
  }
}
