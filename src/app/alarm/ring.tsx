import React from "react";
import { StyleSheet, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { PRAYER_LABELS, PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";
import { clearAlarmRingNavigationGuard } from "@/features/alarm/alarmRouter";
import { useAlarmRingAudio } from "@/features/alarm/useAlarmRingAudio";
import { formatClock } from "@/core/utils/time";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Full-screen alarm ring surface shown when the user opens the app from a
 * prayer alarm. Scan-to-dismiss is the only way to stop the alarm.
 */
export default function AlarmRingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slot?: string | string[]; alarmId?: string | string[] }>();
  const slot = (firstParam(params.slot) as PrayerSlot | undefined) ?? "fajr";
  const alarmId = firstParam(params.alarmId);
  const label = PRAYER_LABELS[slot] ?? "Prayer";

  useAlarmRingAudio(alarmId);

  const onScan = () => {
    haptics.impact();
    clearAlarmRingNavigationGuard();
    const alarmQuery = alarmId ? `&alarmId=${encodeURIComponent(alarmId)}` : "";
    router.replace(`/scan/disarm?slot=${slot}${alarmQuery}`);
  };

  return (
    <>
      <Stack.Screen options={{ presentation: "fullScreenModal" }} />
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
        <Button label="Start object hunt" onPress={onScan} style={styles.actionButton} />
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
