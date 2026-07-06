import React from "react";
import { StyleSheet } from "react-native";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SettingSection } from "@/components/settings/SettingSection";
import { SegmentedControl } from "@/components/settings/SegmentedControl";
import { SelectableRow } from "@/components/settings/SelectableRow";
import { SalahModeCheckboxRow } from "@/components/modes/SalahModeCheckboxRow";
import { MasjidModeSection } from "@/components/settings/MasjidModeSection";
import { BlockingSection } from "@/components/settings/BlockingSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useThemeMode } from "@/core/theme";
import { ThemeMode } from "@/core/theme/theme";
import { usePrayerSettings } from "@/features/prayerTimes/prayerSettingsStore";
import {
  HighLatitudeRuleKey,
  MadhabKey,
} from "@/features/prayerTimes/prayerTimes.types";
import { useModes } from "@/features/modes/modeStore";
import { ALL_SALAH_MODES } from "@/features/modes/mode.types";
import { useAlarmSound } from "@/features/alarm/alarmSoundStore";
import { ALARM_SOUNDS } from "@/features/alarm/alarmSounds";

export default function SettingsScreen() {
  const { mode: themeMode, setMode } = useThemeMode();
  const { settings, update, autoByCountry, setAutoByCountry } = usePrayerSettings();
  const { enabledModes, toggleMode } = useModes();
  const { selectedId: soundId, select: selectSound } = useAlarmSound();

  return (
    <Screen scroll tabBarPadding>
      <ThemedText variant="title">Settings</ThemedText>

      <SettingSection title="Appearance">
        <SegmentedControl<ThemeMode>
          value={themeMode}
          onChange={setMode}
          options={[
            { value: "system", label: "System" },
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
        />
      </SettingSection>

      <SettingSection title="When prayer time arrives">
        {ALL_SALAH_MODES.map((mode, index) => (
          <SalahModeCheckboxRow
            key={mode}
            mode={mode}
            checked={enabledModes.includes(mode)}
            onToggle={() => {
              const isOnlySelected = enabledModes.length === 1 && enabledModes.includes(mode);
              if (!isOnlySelected) toggleMode(mode);
            }}
            last={index === ALL_SALAH_MODES.length - 1}
          />
        ))}
      </SettingSection>

      <BlockingSection />
      <MasjidModeSection />

      <SettingSection title="Accessibility">
        <ToggleRow
          label="Auto by country"
          value={autoByCountry}
          onValueChange={setAutoByCountry}
        />

        <ThemedText variant="caption" color="textSecondary" style={styles.fieldLabelSpaced}>
          Asr calculation (Madhab)
        </ThemedText>
        <SegmentedControl<MadhabKey>
          value={settings.madhab}
          onChange={(madhab) => update({ madhab })}
          options={[
            { value: "Shafi", label: "Standard" },
            { value: "Hanafi", label: "Hanafi" },
          ]}
        />

        <ThemedText variant="caption" color="textSecondary" style={styles.fieldLabelSpaced}>
          High latitude rule
        </ThemedText>
        <SegmentedControl<HighLatitudeRuleKey>
          value={settings.highLatitudeRule}
          onChange={(highLatitudeRule) => update({ highLatitudeRule })}
          options={[
            { value: "MiddleOfTheNight", label: "Mid-night" },
            { value: "SeventhOfTheNight", label: "1/7 night" },
            { value: "TwilightAngle", label: "Angle" },
          ]}
        />
      </SettingSection>

      <SettingSection title="Alarm sound">
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  fieldLabelSpaced: { marginTop: 20, marginBottom: 8 },
});
