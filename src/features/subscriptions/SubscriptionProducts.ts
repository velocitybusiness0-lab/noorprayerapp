import type { SubscriptionCatalogKey } from "./subscription.types";

/**
 * App Store subscription product identifiers for Miraj.
 *
 * These IDs are used verbatim in App Store Connect and StoreKit testing.
 * Display names in App Store Connect may still say "Feather …" from a prior
 * product draft; the app bundle is Miraj (`insiders.miraj`).
 */
export class SubscriptionProducts {
  /** Feather Pro — primary tier with a free trial (confirm price in ASC). */
  static readonly pro = "Feather";

  /** Feather Free — annual plan with a 3-day free trial at $49.99. */
  static readonly freeYearly = "Feather.Free";

  /** Feather Family offer — annual family plan at $69.99. */
  static readonly familyOffer = "Feather.Family.Offer";

  /** Default SKU when presenting a single upgrade path. */
  static readonly defaultProductId = SubscriptionProducts.freeYearly;

  /** All configured subscription product IDs. */
  static readonly allProductIds = [
    SubscriptionProducts.pro,
    SubscriptionProducts.freeYearly,
    SubscriptionProducts.familyOffer,
  ] as const;

  static readonly catalogKeysByProductId: Record<string, SubscriptionCatalogKey> = {
    [SubscriptionProducts.pro]: "pro",
    [SubscriptionProducts.freeYearly]: "freeYearly",
    [SubscriptionProducts.familyOffer]: "familyOffer",
  };

  static isKnownProductId(productId: string): productId is (typeof SubscriptionProducts.allProductIds)[number] {
    return (SubscriptionProducts.allProductIds as readonly string[]).includes(productId);
  }

  static catalogKeyFor(productId: string): SubscriptionCatalogKey | null {
    return SubscriptionProducts.catalogKeysByProductId[productId] ?? null;
  }
}
