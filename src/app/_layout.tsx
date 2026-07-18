/* eslint-disable import/no-duplicates -- side-effect import must stay first */
import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
/* eslint-enable import/no-duplicates */
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, useTheme } from "@/core/theme";
import { AppBootstrap } from "@/features/bootstrap/AppBootstrap";
import { RootErrorBoundary } from "@/features/bootstrap/RootErrorBoundary";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Older binaries / Expo Go may not support this.
});

export const unstable_settings = {
  initialRouteName: "index",
};

function RootNavigator() {
  const theme = useTheme();

  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <AppBootstrap />
      {/* Auto-register every file under src/app — do not list Stack.Screen manually. */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: "fade",
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootErrorBoundary>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </RootErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
