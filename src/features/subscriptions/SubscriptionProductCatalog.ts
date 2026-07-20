import { SubscriptionProducts } from "./SubscriptionProducts";
import type { SubscriptionProductDefinition } from "./subscription.types";

/**
 * Human-readable catalog for Miraj subscription SKUs.
 * Keep in sync with App Store Connect and `storekit/MirajSubscriptions.storekit`.
 */
export class SubscriptionProductCatalog {
  static readonly groupName = "Miraj Pro";

  static readonly products: SubscriptionProductDefinition[] = [
    {
      productId: SubscriptionProducts.pro,
      catalogKey: "pro",
      referenceName: "Feather Pro",
      displayName: "Feather Pro (Free Trial)",
      description: "Full Miraj Pro access with an introductory free trial.",
      billingPeriod: "yearly",
      // Confirm recurring price in App Store Connect before shipping.
      priceUsd: null,
      familyShareable: false,
      introductoryOffer: {
        period: "P7D",
        paymentMode: "free",
      },
    },
    {
      productId: SubscriptionProducts.freeYearly,
      catalogKey: "freeYearly",
      referenceName: "Feather Free Yearly",
      displayName: "Feather Free",
      description: "Annual Miraj Pro access with a 3-day free trial.",
      billingPeriod: "yearly",
      priceUsd: 49.99,
      familyShareable: false,
      introductoryOffer: {
        period: "P3D",
        paymentMode: "free",
      },
    },
    {
      productId: SubscriptionProducts.familyOffer,
      catalogKey: "familyOffer",
      referenceName: "Feather Family Offer",
      displayName: "Feather Family (Offer)",
      description: "Annual Miraj Pro for families via App Store Family Sharing.",
      billingPeriod: "yearly",
      priceUsd: 69.99,
      familyShareable: true,
      introductoryOffer: null,
    },
  ];

  static byProductId(productId: string): SubscriptionProductDefinition | undefined {
    return SubscriptionProductCatalog.products.find((product) => product.productId === productId);
  }

  static byCatalogKey(catalogKey: SubscriptionProductDefinition["catalogKey"]): SubscriptionProductDefinition {
    const product = SubscriptionProductCatalog.products.find((entry) => entry.catalogKey === catalogKey);
    if (!product) {
      throw new Error(`Unknown subscription catalog key: ${catalogKey}`);
    }
    return product;
  }
}
