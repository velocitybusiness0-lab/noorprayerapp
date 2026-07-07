import React from "react";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";

export default function OnboardingScreen() {
  return (
    <Screen>
      <ThemedText variant="title">Welcome to Miraj</ThemedText>
      <ThemedText variant="body" color="textSecondary">
        Onboarding is refined during polish.
      </ThemedText>
    </Screen>
  );
}
