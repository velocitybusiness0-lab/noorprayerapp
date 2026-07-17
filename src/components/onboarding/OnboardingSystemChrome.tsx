import React, { useEffect } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useTheme } from "@/core/theme";
import { OnboardingPastelPalette } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingPastelTone } from "@/features/onboarding/onboarding.types";

interface OnboardingSystemChromeProps {
  pastel: OnboardingPastelTone;
}

type NavigationBarModule = typeof import("expo-navigation-bar");

/** Loads expo-navigation-bar only when the native module exists in the dev build. */
function loadNavigationBar(): NavigationBarModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-navigation-bar") as NavigationBarModule;
  } catch {
    return null;
  }
}

/** Matches status bar and Android nav bar to the onboarding page color. */
export function OnboardingSystemChrome({ pastel }: OnboardingSystemChromeProps) {
  const theme = useTheme();
  const colors = OnboardingPastelPalette.forTone(pastel, theme.isDark);
  const onDark =
    pastel === "hardRed" || pastel === "deepBlue" || pastel === "hope";

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const navigationBar = loadNavigationBar();

    void SystemUI.setBackgroundColorAsync(colors.bg).catch(() => undefined);
    void navigationBar?.setBackgroundColorAsync(colors.bg).catch(() => undefined);
    void navigationBar
      ?.setButtonStyleAsync(onDark ? "light" : "dark")
      .catch(() => undefined);

    return () => {
      void SystemUI.setBackgroundColorAsync(theme.colors.background).catch(
        () => undefined
      );
      void navigationBar
        ?.setBackgroundColorAsync(theme.colors.background)
        .catch(() => undefined);
      void navigationBar
        ?.setButtonStyleAsync(theme.isDark ? "light" : "dark")
        .catch(() => undefined);
    };
  }, [colors.bg, onDark, theme.colors.background, theme.isDark]);

  return <StatusBar style={onDark ? "light" : "dark"} backgroundColor={colors.bg} />;
}
