import React from "react";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { PRAYER_LABELS, ObligatoryPrayer, PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";
import { useHistory } from "@/features/history/historyStore";
import { alarmManager } from "@/features/alarm/AlarmManager";
import { formatClock } from "@/core/utils/time";

/**
 * Full-screen alarm ring surface shown when the user opens the app from a
 * prayer alarm. Leads to scan-to-dismiss, with manual logging as a fallback.
 */
export default function AlarmRingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slot?: string; alarmId?: string }>();
  const slot = (params.slot as PrayerSlot) ?? "fajr";
  const label = PRAYER_LABELS[slot] ?? "Prayer";

  const dismissAlarm = async () => {
    if (params.alarmId) await alarmManager.stop(params.alarmId);
  };

  const onScan = () => {
    haptics.impact();
    router.replace(`/scan/disarm?slot=${slot}`);
  };

  const onPrayed = async () => {
    haptics.success();
    if (slot !== "sunrise") {
      await useHistory.getState().logPrayed(slot as ObligatoryPrayer, "manual");
    }
    await dismissAlarm();
    router.replace("/");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingTop: insets.top + 40 },
      ]}
    >
      <View style={styles.top}>
        <Ionicons name="alarm" size={40} color={theme.colors.textPrimary} />
        <ThemedText variant="caption" color="textTertiary" style={styles.now}>
          {formatClock(new Date())}
        </ThemedText>
        <ThemedText variant="display">{label}</ThemedText>
        <ThemedText variant="body" color="textSecondary">
          It's time to pray. Get up and make wudu.
        </ThemedText>
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + 24 }]}>
        <Button label="Scan to dismiss" onPress={onScan} />
        <Button label="I've prayed" variant="secondary" onPress={onPrayed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", paddingHorizontal: 24 },
  top: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  now: { letterSpacing: 2 },
  actions: { gap: 12 },
});
