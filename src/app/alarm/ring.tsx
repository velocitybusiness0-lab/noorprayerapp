import React from "react";
import { StyleSheet, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import {
  ObligatoryPrayer,
  PRAYER_LABELS,
  PrayerSlot,
} from "@/features/prayerTimes/prayerTimes.types";
import { clearAlarmRingNavigationGuard } from "@/features/alarm/alarmRouter";
import { alarmObjectHuntRouteBuilder } from "@/features/alarm/AlarmObjectHuntRouteBuilder";
import { useAlarmRingAudio } from "@/features/alarm/useAlarmRingAudio";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";
import { formatClock } from "@/core/utils/time";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function asObligatorySlot(slot: PrayerSlot | undefined): ObligatoryPrayer {
  if (slot && slot !== "sunrise") return slot;
  return "fajr";
}

/**
 * Alarm continue gate — shown before object hunt so the camera only opens
 * after the user taps Continue.
 */
export default function AlarmRingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slot?: string | string[]; alarmId?: string | string[] }>();
  const slot = asObligatorySlot(firstParam(params.slot) as PrayerSlot | undefined);
  const alarmId = firstParam(params.alarmId);
  const label = PRAYER_LABELS[slot] ?? "Prayer";

  useHideTabBar("alarm-ring");
  useAlarmRingAudio(alarmId);

  const onContinue = () => {
    if (!alarmId) {
      router.replace("/");
      return;
    }
    haptics.impact();
    clearAlarmRingNavigationGuard();
    router.replace(alarmObjectHuntRouteBuilder.build(slot, alarmId));
  };

  return (
    <>
      <Stack.Screen options={{ presentation: "fullScreenModal", gestureEnabled: false }} />
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background, paddingTop: insets.top + 40 },
        ]}
      >
        <View style={styles.top} pointerEvents="box-none">
          <Ionicons name="alarm" size={40} color={theme.colors.textPrimary} />
          <ThemedText variant="caption" color="textTertiary" style={styles.now}>
            {formatClock(new Date())}
          </ThemedText>
          <ThemedText variant="display">{label}</ThemedText>
          <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
            Scan the object to dismiss the alarm.
          </ThemedText>
        </View>

        <View style={[styles.actions, { paddingBottom: insets.bottom + 24 }]}>
          <Button label="Continue" onPress={onContinue} style={styles.actionButton} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", paddingHorizontal: 24 },
  top: { flexGrow: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  subtitle: { textAlign: "center", maxWidth: 300 },
  now: { letterSpacing: 2 },
  actions: { gap: 12, zIndex: 2 },
  actionButton: { alignSelf: "stretch" },
});
