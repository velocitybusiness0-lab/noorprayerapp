import React from "react";
import { StyleSheet } from "react-native";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SettingSection } from "@/components/settings/SettingSection";
import { SegmentedControl } from "@/components/settings/SegmentedControl";
import { SelectableRow } from "@/components/settings/SelectableRow";
import { MasjidModeSection } from "@/components/settings/MasjidModeSection";
import { BlockingSection } from "@/components/settings/BlockingSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { useThemeMode } from "@/core/theme";
import { ThemeMode } from "@/core/theme/theme";
import { usePrayerSettings } from "@/features/prayerTimes/prayerSettingsStore";
import {
  CalculationMethodKey,
  HighLatitudeRuleKey,
  MadhabKey,
} from "@/features/prayerTimes/prayerTimes.types";
import { CALCULATION_METHOD_LABELS } from "@/features/prayerTimes/CalculationConfig";
import { useModes } from "@/features/modes/modeStore";
import {
  SALAH_MODE_DESCRIPTIONS,
  SalahMode,
} from "@/features/modes/mode.types";
import { useAlarmSound } from "@/features/alarm/alarmSoundStore";
import { ALARM_SOUNDS } from "@/features/alarm/alarmSounds";

const METHOD_KEYS = Object.keys(CALCULATION_METHOD_LABELS) as CalculationMethodKey[];

export default function SettingsScreen() {
  const { mode: themeMode, setMode } = useThemeMode();
  const { settings, update, autoByCountry, setAutoByCountry, detectedCountryName } =
    usePrayerSettings();
  const { global: globalMode, setGlobal } = useModes();
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

      <SettingSection title="Default mode at prayer time">
        <SegmentedControl<SalahMode>
          value={globalMode}
          onChange={setGlobal}
          options={[
            { value: "alarm", label: "Alarm" },
            { value: "block", label: "Block" },
            { value: "reminder", label: "Remind" },
          ]}
        />
        <ThemedText variant="caption" color="textTertiary" style={styles.hint}>
          {SALAH_MODE_DESCRIPTIONS[globalMode]}
        </ThemedText>
      </SettingSection>

      <BlockingSection />
      <MasjidModeSection />

      <SettingSection title="Asr calculation (Madhab)">
        <SegmentedControl<MadhabKey>
          value={settings.madhab}
          onChange={(madhab) => update({ madhab })}
          options={[
            { value: "Shafi", label: "Standard" },
            { value: "Hanafi", label: "Hanafi" },
          ]}
        />
      </SettingSection>

      <SettingSection title="High latitude rule">
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

      <SettingSection title="Prayer times for your country">
        <ToggleRow
          label="Auto-adjust for my country"
          description="Uses the standard method for your location — UK, US, Japan, Brazil, and every other country worldwide."
          value={autoByCountry}
          onValueChange={setAutoByCountry}
        />
        {detectedCountryName && (
          <ThemedText variant="caption" color="textTertiary" style={styles.hint}>
            {autoByCountry
              ? `Detected: ${detectedCountryName} — using ${CALCULATION_METHOD_LABELS[settings.method]}`
              : `Detected: ${detectedCountryName} — manual method selected`}
          </ThemedText>
        )}
      </SettingSection>

      <SettingSection title="Calculation method">
        {METHOD_KEYS.map((key, i) => (
          <SelectableRow
            key={key}
            label={CALCULATION_METHOD_LABELS[key]}
            selected={settings.method === key}
            onPress={() => update({ method: key })}
            last={i === METHOD_KEYS.length - 1}
          />
        ))}
      </SettingSection>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: 10 },
});
