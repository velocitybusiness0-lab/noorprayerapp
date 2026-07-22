import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";

/** Local entitlement flags — Superwall remains source of truth for purchases. */
export type SubscriptionEntitlement = "none" | "trial" | "active";

/**
 * Soft local entitlement for try-for-free / limited access when Superwall
 * grants a trial path or when billing is unavailable (dev / Expo Go).
 */
export class SubscriptionEntitlementStore {
  get(): SubscriptionEntitlement {
    const raw = storage.getString(StorageKeys.subscriptionEntitlement);
    if (raw === "trial" || raw === "active" || raw === "none") return raw;
    if (storage.getBoolean(StorageKeys.subscriptionTrial) === true) return "trial";
    return "none";
  }

  isTrial(): boolean {
    return this.get() === "trial";
  }

  isActiveOrTrial(): boolean {
    const value = this.get();
    return value === "active" || value === "trial";
  }

  markTrial(): void {
    storage.setString(StorageKeys.subscriptionEntitlement, "trial");
    storage.setBoolean(StorageKeys.subscriptionTrial, true);
  }

  markActive(): void {
    storage.setString(StorageKeys.subscriptionEntitlement, "active");
    storage.setBoolean(StorageKeys.subscriptionTrial, false);
  }

  clear(): void {
    storage.setString(StorageKeys.subscriptionEntitlement, "none");
    storage.setBoolean(StorageKeys.subscriptionTrial, false);
  }
}

export const subscriptionEntitlementStore = new SubscriptionEntitlementStore();
