import {
  ALL_MOTIVATION_CATEGORIES,
  DEFAULT_MOTIVATION_PREFS,
  MotivationCategoryId,
  MotivationNotificationPrefs,
  MotivationPrefs,
  MotivationWindowPreset,
} from "./motivation.types";
import { MotivationWindowPresetCatalog } from "./MotivationWindowPresetCatalog";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 12;

/** Legacy shape that may still exist in stored prefs (custom From/To hours or single preset). */
type LegacyNotificationPrefs = Partial<MotivationNotificationPrefs> & {
  windowStartHour?: number;
  windowEndHour?: number;
  /** @deprecated Migrated to `windowPresets`. */
  windowPreset?: string;
  windowPresets?: unknown;
};

/** Validates and normalizes motivation preference mutations. */
export class MotivationPrefsManager {
  static readonly quantityMin = MIN_QUANTITY;
  static readonly quantityMax = MAX_QUANTITY;

  static clampQuantity(value: number): number {
    if (!Number.isFinite(value)) return MIN_QUANTITY;
    return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.round(value)));
  }

  static toggleCategory(
    prefs: MotivationPrefs,
    categoryId: MotivationCategoryId
  ): MotivationPrefs {
    const enabled = prefs.enabledCategories.includes(categoryId);
    if (enabled && prefs.enabledCategories.length === 1) {
      return prefs;
    }
    const enabledCategories = enabled
      ? prefs.enabledCategories.filter((id) => id !== categoryId)
      : [...prefs.enabledCategories, categoryId];
    return { ...prefs, enabledCategories };
  }

  /** Toggles a When preset; keeps at least one selected (same as content types). */
  static toggleWindowPreset(
    prefs: MotivationPrefs,
    preset: MotivationWindowPreset
  ): MotivationPrefs {
    const current = MotivationWindowPresetCatalog.normalizeList(
      prefs.notifications.windowPresets
    );
    const selected = current.includes(preset);
    if (selected && current.length === 1) {
      return prefs;
    }
    const windowPresets = selected
      ? current.filter((id) => id !== preset)
      : MotivationWindowPresetCatalog.normalizeList([...current, preset]);
    return MotivationPrefsManager.withNotifications(prefs, { windowPresets });
  }

  static withNotifications(
    prefs: MotivationPrefs,
    patch: Partial<MotivationNotificationPrefs>
  ): MotivationPrefs {
    const next = { ...prefs.notifications, ...patch };
    return {
      ...prefs,
      notifications: MotivationPrefsManager.normalizeNotifications(next),
    };
  }

  static sanitize(raw: Partial<MotivationPrefs> | null | undefined): MotivationPrefs {
    if (!raw) return { ...DEFAULT_MOTIVATION_PREFS };
    const categories = (raw.enabledCategories ?? []).filter((id) =>
      ALL_MOTIVATION_CATEGORIES.includes(id)
    );
    const notifications = MotivationPrefsManager.migrateNotifications(raw.notifications);
    const base: MotivationPrefs = {
      enabledCategories:
        categories.length > 0 ? categories : [...DEFAULT_MOTIVATION_PREFS.enabledCategories],
      notifications: {
        ...DEFAULT_MOTIVATION_PREFS.notifications,
        ...notifications,
      },
    };
    return MotivationPrefsManager.withNotifications(base, {});
  }

  /**
   * Migrates legacy custom hour windows / single `windowPreset` → `windowPresets`.
   * Empty or corrupt → default `["morning"]`.
   */
  private static migrateNotifications(
    raw: LegacyNotificationPrefs | null | undefined
  ): Partial<MotivationNotificationPrefs> {
    if (!raw) return {};

    const windowPresets = MotivationPrefsManager.resolvePresets(raw);
    const next: Partial<MotivationNotificationPrefs> = { windowPresets };
    if (typeof raw.enabled === "boolean") next.enabled = raw.enabled;
    if (raw.quantityPerDay !== undefined) next.quantityPerDay = raw.quantityPerDay;
    return next;
  }

  private static resolvePresets(raw: LegacyNotificationPrefs): MotivationWindowPreset[] {
    if (Array.isArray(raw.windowPresets)) {
      const fromArray = MotivationWindowPresetCatalog.normalizeList(raw.windowPresets);
      if (fromArray.length > 0) return fromArray;
    }
    if (MotivationWindowPresetCatalog.isPreset(raw.windowPreset)) {
      return [raw.windowPreset];
    }
    const start = raw.windowStartHour;
    const end = raw.windowEndHour;
    if (start !== undefined || end !== undefined) {
      return [
        MotivationWindowPresetCatalog.nearestFromHours(
          Number.isFinite(start) ? (start as number) : Number.NaN,
          Number.isFinite(end) ? (end as number) : Number.NaN
        ),
      ];
    }
    return [...DEFAULT_MOTIVATION_PREFS.notifications.windowPresets];
  }

  private static normalizeNotifications(
    prefs: MotivationNotificationPrefs
  ): MotivationNotificationPrefs {
    const windowPresets = MotivationWindowPresetCatalog.normalizeList(
      prefs.windowPresets ?? []
    );
    const resolved =
      windowPresets.length > 0
        ? windowPresets
        : [...DEFAULT_MOTIVATION_PREFS.notifications.windowPresets];

    return {
      enabled: Boolean(prefs.enabled),
      quantityPerDay: MotivationPrefsManager.clampQuantity(
        Number.isFinite(prefs.quantityPerDay) ? prefs.quantityPerDay : MIN_QUANTITY
      ),
      windowPresets: resolved,
    };
  }
}
