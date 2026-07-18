import { router } from "expo-router";
import { haptics } from "@/core/haptics/HapticsManager";
import { clearAlarmRingNavigationGuard } from "@/features/alarm/alarmRouter";
import { activeAlarmController } from "@/features/alarm/ActiveAlarmController";
import { useHistory } from "@/features/history/historyStore";
import { usePreDisarm } from "@/features/masjidMode/preDisarmStore";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { scanSessionGuard } from "./ScanSessionGuard";
import { ScanPurpose } from "./scanTargets";

export interface ScanDismissOptions {
  purpose: ScanPurpose;
  prayerSlot?: ObligatoryPrayer;
  alarmId?: string;
}

/** Runs post-scan cleanup and always leaves the scan screen. */
export class ScanDismissCoordinator {
  async complete({ purpose, prayerSlot, alarmId }: ScanDismissOptions): Promise<void> {
    haptics.success();
    clearAlarmRingNavigationGuard();

    try {
      if (prayerSlot && purpose === "predisarm") {
        usePreDisarm.getState().preDisarm(prayerSlot);
      }
      if (prayerSlot && purpose === "disarm") {
        await useHistory.getState().logPrayed(prayerSlot, "scan");
      }
      await activeAlarmController.confirmDismiss(alarmId);
    } catch (error) {
      console.warn("[Scan] Dismiss cleanup failed", error);
      try {
        await activeAlarmController.confirmDismiss(alarmId);
      } catch {
        // Alarm stop is best-effort if history logging failed.
      }
    } finally {
      scanSessionGuard.close();
      router.replace("/");
    }
  }
}

export const scanDismissCoordinator = new ScanDismissCoordinator();
