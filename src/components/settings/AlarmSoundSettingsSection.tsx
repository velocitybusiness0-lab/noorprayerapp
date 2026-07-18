import React from "react";
import { SettingSection } from "@/components/settings/SettingSection";
import { SelectableRow } from "@/components/settings/SelectableRow";
import { useAlarmSound } from "@/features/alarm/alarmSoundStore";
import { ALARM_SOUNDS } from "@/features/alarm/alarmSounds";

/** Alarm ringtone picker. */
export function AlarmSoundSettingsSection() {
  const { selectedId: soundId, select: selectSound } = useAlarmSound();

  return (
    <SettingSection title="Sounds">
      {ALARM_SOUNDS.map((sound, i) => (
        <SelectableRow
          key={sound.id}
          label={sound.label}
          selected={soundId === sound.id}
          onPress={() => selectSound(sound.id)}
          last={i === ALARM_SOUNDS.length - 1}
        />
      ))}
    </SettingSection>
  );
}
