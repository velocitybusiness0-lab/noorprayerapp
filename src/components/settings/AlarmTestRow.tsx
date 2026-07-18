import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SettingActionRow } from "@/components/settings/SettingActionRow";
import { ThemedText } from "@/components/primitives/ThemedText";
import { haptics } from "@/core/haptics/HapticsManager";
import { formatClock } from "@/core/utils/time";
import { useAlarmSound } from "@/features/alarm/alarmSoundStore";
import { alarmTestScheduler } from "@/features/alarm/AlarmTestScheduler";

/** Dev-only row that schedules a smart alarm one minute from now. */
export function AlarmTestRow() {
  const soundId = useAlarmSound((s) => s.selectedId);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!__DEV__) return null;

  const onPress = () => {
    if (busy) return;

    void (async () => {
      setBusy(true);
      setStatus(null);

      try {
        const result = await alarmTestScheduler.scheduleInOneMinute(soundId);
        if (!result.ok) {
          haptics.warning();
          setStatus(result.message);
          return;
        }

        haptics.success();
        setStatus(
          `Test set for ${formatClock(result.fireAt)}. ${result.detail}`
        );
      } finally {
        setBusy(false);
      }
    })();
  };

  return (
    <View>
      <SettingActionRow
        label={busy ? "Scheduling…" : "Test alarm in 1 minute"}
        description="Keep Miraj open. Rings for Maghrib — complete object hunt to dismiss."
        icon="alarm-outline"
        onPress={onPress}
      />
      {status ? (
        <ThemedText variant="caption" color="textSecondary" style={styles.status}>
          {status}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  status: { marginTop: 4, marginBottom: 12, paddingHorizontal: 2 },
});
