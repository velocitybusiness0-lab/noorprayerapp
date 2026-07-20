import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/core/theme";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { alarmObjectHuntLaunchCoordinator } from "@/features/alarm/AlarmObjectHuntLaunchCoordinator";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Deep-link entry for AlarmKit lock-screen Open / Continue actions (legacy
 * `object-hunt` path). Resolves the prayer slot and opens the Continue / ring
 * gate — never the camera.
 */
export default function AlarmObjectHuntEntryScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{
    alarmId?: string | string[];
    slot?: string | string[];
  }>();
  const alarmId = firstParam(params.alarmId);
  const slotHint = firstParam(params.slot) as ObligatoryPrayer | undefined;

  useHideTabBar("alarm-object-hunt");

  useEffect(() => {
    if (!alarmId) return;
    alarmObjectHuntLaunchCoordinator.open(alarmId, slotHint);
  }, [alarmId, slotHint]);

  return (
    <>
      <Stack.Screen options={{ presentation: "fullScreenModal", gestureEnabled: false }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.textPrimary} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
