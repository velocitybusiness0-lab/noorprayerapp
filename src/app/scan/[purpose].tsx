import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { ScanOverlay } from "@/components/scan/ScanOverlay";
import { useScanSession } from "@/features/scan/useScanSession";
import { ScanPurpose } from "@/features/scan/scanTargets";
import { runUnblock } from "@/features/scan/scanActions";
import { alarmManager } from "@/features/alarm/AlarmManager";
import { useHistory } from "@/features/history/historyStore";
import { usePreDisarm } from "@/features/masjidMode/preDisarmStore";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

const VALID_PURPOSES: ScanPurpose[] = ["disarm", "unblock", "predisarm"];

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

  const [permission, requestPermission] = useCameraPermissions();
  const granted = permission?.granted ?? false;

  const finish = useCallback(async () => {
    haptics.success();
    const slot = params.slot as ObligatoryPrayer | undefined;
    if (slot && purpose === "disarm") {
      // Scanned at prayer time = confirmed getting up to pray -> log it.
      await useHistory.getState().logPrayed(slot, "scan");
    }
    if (slot && purpose === "predisarm") {
      // Scanned beforehand (heading to masjid) -> silence the upcoming alarm.
      usePreDisarm.getState().preDisarm(slot);
    }
    if (params.alarmId) await alarmManager.stop(params.alarmId);
    if (purpose === "unblock") await runUnblock();
    setTimeout(() => router.replace("/"), 700);
  }, [params.slot, params.alarmId, purpose]);

  const session = useScanSession({ purpose, active: granted, onSuccess: finish });

  if (!granted) {
    return (
      <View style={[styles.permission, { backgroundColor: theme.colors.background }]}>
        <ThemedText variant="title">Camera access</ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.permissionText}>
          Noor needs the camera so you can scan your prayer mat, sink, or the
          masjid to continue.
        </ThemedText>
        <Button label="Allow camera" onPress={requestPermission} />
        <Button label="Go back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <CameraView ref={session.cameraRef} style={StyleSheet.absoluteFill} facing="back" />
      <ScanOverlay
        targets={session.acceptedTargets}
        isAutomatic={session.isAutomatic}
        scanning={session.scanning}
        confidence={session.confidence}
        succeeded={session.succeeded}
        onManualConfirm={session.confirmManually}
        onCancel={() => router.back()}
      />
    </View>
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
