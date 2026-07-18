import React from "react";
import { SettingSection } from "@/components/settings/SettingSection";
import { SalahModeCheckboxRow } from "@/components/modes/SalahModeCheckboxRow";
import { useModes } from "@/features/modes/modeStore";
import { ALL_SALAH_MODES } from "@/features/modes/mode.types";

/** What happens when a prayer time arrives. */
export function PrayerAlertsSettingsSection() {
  const { enabledModes, toggleMode } = useModes();

  return (
    <SettingSection title="Alerts">
      {ALL_SALAH_MODES.map((mode, index) => (
        <SalahModeCheckboxRow
          key={mode}
          mode={mode}
          checked={enabledModes.includes(mode)}
          onToggle={() => {
            const isOnlySelected =
              enabledModes.length === 1 && enabledModes.includes(mode);
            if (!isOnlySelected) toggleMode(mode);
          }}
          last={index === ALL_SALAH_MODES.length - 1}
        />
      ))}
    </SettingSection>
  );
}
