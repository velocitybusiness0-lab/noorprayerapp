import React from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/primitives/Button";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SettingSection } from "@/components/settings/SettingSection";
import { haptics } from "@/core/haptics/HapticsManager";
import { onboardingCompletionStore } from "@/features/onboarding/OnboardingCompletionStore";

/** Restarts the onboarding flow from Settings. */
export function OnboardingReplaySection() {
  const onPress = () => {
    haptics.selection();
    onboardingCompletionStore.reset();
    router.push("/onboarding");
  };

  return (
    <SettingSection title="Onboarding">
      <Button
        label="Run onboarding again"
        onPress={onPress}
        variant="secondary"
        style={styles.button}
      />
      <ThemedText variant="caption" color="textTertiary" style={styles.hint}>
        Opens the welcome flow from the start.
      </ThemedText>
    </SettingSection>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: "stretch" },
  hint: { marginTop: 10 },
});
