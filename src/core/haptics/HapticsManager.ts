import * as Haptics from "expo-haptics";

/**
 * Single entry point for tactile feedback so UI components never call the
 * platform API directly. Keeps feedback consistent and easy to tune/disable.
 */
export class HapticsManager {
  private enabled = true;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /** Light tap for standard selections and button presses. */
  selection(): void {
    if (!this.enabled) return;
    void Haptics.selectionAsync();
  }

  /** Medium impact for toggles and mode changes. */
  impact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium): void {
    if (!this.enabled) return;
    void Haptics.impactAsync(style);
  }

  /** Positive confirmation, e.g. marking a prayer complete. */
  success(): void {
    if (!this.enabled) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  warning(): void {
    if (!this.enabled) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  error(): void {
    if (!this.enabled) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

export const haptics = new HapticsManager();
