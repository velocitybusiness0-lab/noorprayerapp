/** Billing period for a recurring App Store subscription SKU. */
export type SubscriptionBillingPeriod = "yearly";

/** Introductory offer attached to a subscription SKU. */
export interface SubscriptionIntroOffer {
  /** ISO 8601 duration fragment, e.g. P3D for three days. */
  period: string;
  paymentMode: "free" | "payUpFront" | "payAsYouGo";
}

/** Metadata for a StoreKit subscription product configured in App Store Connect. */
export interface SubscriptionProductDefinition {
  /** App Store product identifier (must match App Store Connect exactly). */
  productId: string;
  /** Internal key used by paywall / analytics code. */
  catalogKey: SubscriptionCatalogKey;
  referenceName: string;
  displayName: string;
  description: string;
  billingPeriod: SubscriptionBillingPeriod;
  /** USD list price shown in App Store Connect. Null when not yet finalized. */
  priceUsd: number | null;
  familyShareable: boolean;
  introductoryOffer: SubscriptionIntroOffer | null;
}

export type SubscriptionCatalogKey = "pro" | "freeYearly" | "familyOffer";
