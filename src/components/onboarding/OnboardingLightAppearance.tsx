import React, { ReactNode, useEffect } from "react";
import { Platform } from "react-native";
import * as SystemUI from "expo-system-ui";
import { ForcedSchemeThemeProvider, useTheme } from "@/core/theme";
import { OnboardingColorSchemeLock } from "@/features/onboarding/OnboardingColorSchemeLock";

type NavigationBarModule = typeof import("expo-navigation-bar");

function loadNavigationBar(): NavigationBarModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-navigation-bar") as NavigationBarModule;
  } catch {
    return null;
  }
}

interface OnboardingLightAppearanceProps {
  children: ReactNode;
}

/**
 * Forces light theme tokens + Appearance for the onboarding subtree only.
 * On unmount, restores Appearance and Android system chrome to the parent theme.
 */
export function OnboardingLightAppearance({
  children,
}: OnboardingLightAppearanceProps) {
  const parentTheme = useTheme();

  useEffect(() => {
    OnboardingColorSchemeLock.engage();
    return () => {
      OnboardingColorSchemeLock.release();
      if (Platform.OS !== "android") return;

      const navigationBar = loadNavigationBar();
      void SystemUI.setBackgroundColorAsync(parentTheme.colors.background).catch(
        () => undefined
      );
      void navigationBar
        ?.setBackgroundColorAsync(parentTheme.colors.background)
        .catch(() => undefined);
      void navigationBar
        ?.setButtonStyleAsync(parentTheme.isDark ? "light" : "dark")
        .catch(() => undefined);
    };
  }, [parentTheme.colors.background, parentTheme.isDark]);

  return (
    <ForcedSchemeThemeProvider scheme="light">{children}</ForcedSchemeThemeProvider>
  );
}
