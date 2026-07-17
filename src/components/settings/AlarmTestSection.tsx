import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "@/components/primitives/Button";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SettingSection } from "@/components/settings/SettingSection";
import { haptics } from "@/core/haptics/HapticsManager";
import { formatClock } from "@/core/utils/time";
import { useAlarmSound } from "@/features/alarm/alarmSoundStore";
import { alarmTestScheduler } from "@/features/alarm/AlarmTestScheduler";

/** Dev-only control to fire a smart alarm after one minute. */
export function AlarmTestSection() {
  const soundId = useAlarmSound((s) => s.selectedId);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!__DEV__) return null;

  const onPress = () => {
    void (async () => {
      haptics.impact();
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
        const channel =
          result.channel === "alarmkit"
            ? "AlarmKit (lock screen)"
            : "in-app (keep Miraj open)";
        setStatus(`Test alarm set for ${formatClock(result.fireAt)} via ${channel}.`);
      } finally {
        setBusy(false);
      }
    })();
  };

  return (
    <SettingSection title="Developer">
      <Button
        label={busy ? "Scheduling…" : "Test alarm in 1 minute"}
        onPress={onPress}
        disabled={busy}
        variant="secondary"
        style={styles.button}
      />
      <ThemedText variant="caption" color="textTertiary" style={styles.hint}>
        Rings for Maghrib. Complete the object hunt to dismiss it.
      </ThemedText>
      {status ? (
        <ThemedText variant="caption" color="textSecondary" style={styles.status}>
          {status}
        </ThemedText>
      ) : null}
    </SettingSection>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: "stretch" },
  hint: { marginTop: 10 },
  status: { marginTop: 8 },
});
