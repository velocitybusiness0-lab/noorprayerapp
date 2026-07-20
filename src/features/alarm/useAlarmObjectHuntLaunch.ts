import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import * as Linking from "expo-linking";
import { isExpoGo } from "@/core/runtime/isExpoGo";
import { alarmObjectHuntLaunchCoordinator } from "./AlarmObjectHuntLaunchCoordinator";

/**
 * Cold-start and warm-start handoff from AlarmKit open-app intents into the
 * Continue / ring gate (deep link + app-group pending id). Object hunt opens
 * only after Continue on that screen.
 */
export function useAlarmObjectHuntLaunch(): void {
  useEffect(() => {
    if (isExpoGo() || Platform.OS !== "ios") return;

    let urlSub: { remove: () => void } | null = null;
    let appStateSub: { remove: () => void } | null = null;

    const consume = () => {
      alarmObjectHuntLaunchCoordinator.consumePendingLaunch();
    };

    // App Group handoff may already be written before JS mounts.
    consume();

    void Linking.getInitialURL().then((url) => {
      if (url) alarmObjectHuntLaunchCoordinator.handleUrl(url);
      consume();
    });

    urlSub = Linking.addEventListener("url", ({ url }) => {
      alarmObjectHuntLaunchCoordinator.handleUrl(url);
    });

    appStateSub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      alarmObjectHuntLaunchCoordinator.resetDedupe();
      consume();
    });

    return () => {
      urlSub?.remove();
      appStateSub?.remove();
    };
  }, []);
}
