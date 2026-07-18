import React from "react";
import { StyleSheet } from "react-native";
import { SettingSection } from "@/components/settings/SettingSection";
import { SegmentedControl } from "@/components/settings/SegmentedControl";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { ThemedText } from "@/components/primitives/ThemedText";
import { usePrayerSettings } from "@/features/prayerTimes/prayerSettingsStore";
import {
  HighLatitudeRuleKey,
  MadhabKey,
} from "@/features/prayerTimes/prayerTimes.types";

/** Prayer-time calculation preferences. */
export function PrayerCalculationSettingsSection() {
  const { settings, update, autoByCountry, setAutoByCountry } = usePrayerSettings();

  return (
    <SettingSection title="Prayer times">
      <ToggleRow
        label="Auto by country"
        value={autoByCountry}
        onValueChange={setAutoByCountry}
      />

      <ThemedText variant="caption" color="textSecondary" style={styles.fieldLabel}>
        Asr calculation
      </ThemedText>
      <SegmentedControl<MadhabKey>
        value={settings.madhab}
        onChange={(madhab) => update({ madhab })}
        options={[
          { value: "Shafi", label: "Standard" },
          { value: "Hanafi", label: "Hanafi" },
        ]}
      />

      <ThemedText variant="caption" color="textSecondary" style={styles.fieldLabel}>
        High latitude
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
  );
}

const styles = StyleSheet.create({
  fieldLabel: { marginTop: 20, marginBottom: 8 },
});
