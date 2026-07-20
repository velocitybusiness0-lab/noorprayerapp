import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { ScanOverlay } from "@/components/scan/ScanOverlay";
import { ScanCameraPreview } from "@/components/scan/ScanCameraPreview";
import { useScanSession } from "@/features/scan/useScanSession";
import { ScanPurpose } from "@/features/scan/scanTargets";
import { scanDismissCoordinator } from "@/features/scan/ScanDismissCoordinator";
import { scanSessionGuard } from "@/features/scan/ScanSessionGuard";
import { markAlarmDismissing } from "@/features/alarm/alarmRouter";
import { useAlarmRingAudio } from "@/features/alarm/useAlarmRingAudio";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";
import { ObligatoryPrayer, PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";

const VALID_PURPOSES: ScanPurpose[] = ["disarm"];

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function ScanScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{
    purpose?: string;
    slot?: string;
    alarmId?: string;
  }>();
  const purpose: ScanPurpose = VALID_PURPOSES.includes(params.purpose as ScanPurpose)
    ? (params.purpose as ScanPurpose)
    : "disarm";
  const slot = (firstParam(params.slot) as PrayerSlot | undefined) ?? "fajr";
  const alarmId = firstParam(params.alarmId);

  useHideTabBar("scan");
  useAlarmRingAudio(alarmId);

  useEffect(() => {
    scanSessionGuard.open({ purpose, slot, alarmId });
    markAlarmDismissing(alarmId);
    return () => scanSessionGuard.close();
  }, [purpose, slot, alarmId]);

  const [permission, requestPermission] = useCameraPermissions();
  const granted = permission?.granted ?? false;

  const finish = useCallback(() => {
    const prayerSlot = firstParam(params.slot) as ObligatoryPrayer | undefined;
    void scanDismissCoordinator.complete({
      purpose,
      prayerSlot,
      alarmId,
    });
  }, [params.slot, alarmId, purpose]);

  const session = useScanSession({ purpose, alarmId, active: granted, onSuccess: finish });

  if (!granted) {
    return (
      <>
        <Stack.Screen options={{ presentation: "fullScreenModal" }} />
        <View style={[styles.permission, { backgroundColor: theme.colors.background }]}>
        <ThemedText variant="title">Camera access</ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.permissionText}>
          Miraj needs the camera to verify a sink, bath, or toilet.
          Keep scanning until the right object is found.
        </ThemedText>
        <Button label="Allow camera" onPress={requestPermission} />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ presentation: "fullScreenModal" }} />
      <View style={styles.fill}>
      <ScanCameraPreview session={session} />
      <ScanOverlay
        missionTarget={session.missionTarget}
        targets={session.acceptedTargets}
        isAutomatic={session.isAutomatic}
        needsDevBuild={session.needsDevBuild}
        scanning={session.scanning}
        message={session.message}
        streakProgress={session.streakProgress}
        succeeded={session.succeeded}
        onChangeMissionTarget={session.changeMissionTarget}
      />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#000" },
  permission: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 14,
  },
  permissionText: { marginBottom: 8 },
});
