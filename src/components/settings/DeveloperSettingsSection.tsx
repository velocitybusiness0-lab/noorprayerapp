import React from "react";
import { router } from "expo-router";
import { SettingSection } from "@/components/settings/SettingSection";
import { SettingActionRow } from "@/components/settings/SettingActionRow";
import { AlarmTestRow } from "@/components/settings/AlarmTestRow";
import { onboardingCompletionStore } from "@/features/onboarding/OnboardingCompletionStore";

/** Developer tools and setup shortcuts in one settings group. */
export function DeveloperSettingsSection() {
  const showAlarmTest = __DEV__;

  const replayOnboarding = () => {
    onboardingCompletionStore.reset();
    router.push("/onboarding");
  };

  return (
    <SettingSection title="Developer">
      {showAlarmTest ? <AlarmTestRow /> : null}
      <SettingActionRow
        label="Run onboarding again"
        description="Opens the welcome flow from the start."
        icon="refresh-outline"
        onPress={replayOnboarding}
        last
      />
    </SettingSection>
  );
}
