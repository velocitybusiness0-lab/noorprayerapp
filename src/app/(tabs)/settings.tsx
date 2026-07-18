import React from "react";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { AppearanceSettingsSection } from "@/components/settings/AppearanceSettingsSection";
import { PrayerAlertsSettingsSection } from "@/components/settings/PrayerAlertsSettingsSection";
import { MasjidModeSection } from "@/components/settings/MasjidModeSection";
import { PrayerCalculationSettingsSection } from "@/components/settings/PrayerCalculationSettingsSection";
import { AlarmSoundSettingsSection } from "@/components/settings/AlarmSoundSettingsSection";
import { DeveloperSettingsSection } from "@/components/settings/DeveloperSettingsSection";
import { AppSupportSection } from "@/components/settings/AppSupportSection";

export default function SettingsScreen() {
  return (
    <Screen scroll tabBarPadding>
      <ThemedText variant="title">Settings</ThemedText>

      <AppearanceSettingsSection />
      <PrayerAlertsSettingsSection />
      <MasjidModeSection />
      <PrayerCalculationSettingsSection />
      <AlarmSoundSettingsSection />
      <DeveloperSettingsSection />
      <AppSupportSection />
    </Screen>
  );
}
