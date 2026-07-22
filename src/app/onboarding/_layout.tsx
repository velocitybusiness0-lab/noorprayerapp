import React from "react";
import { Stack } from "expo-router";
import { lightTheme } from "@/core/theme";

/** Onboarding stack: questionnaire → paywall → permissions. */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: lightTheme.colors.background },
        gestureEnabled: false,
      }}
    />
  );
}
