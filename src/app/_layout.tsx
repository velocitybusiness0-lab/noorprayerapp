/* eslint-disable import/no-duplicates -- side-effect import must stay first */
import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
/* eslint-enable import/no-duplicates */
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { lightTheme, ThemeProvider, useTheme } from "@/core/theme";
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
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: "fade",
        }}
      >
        {/* Modal from frame one so the floating tab bar cannot sit above Welcome. */}
        <Stack.Screen
          name="onboarding"
          options={{
            presentation: "fullScreenModal",
            animation: "fade",
            gestureEnabled: false,
            contentStyle: { backgroundColor: lightTheme.colors.background },
          }}
        />
        <Stack.Screen
          name="alarm/ring"
          options={{ presentation: "fullScreenModal", gestureEnabled: false }}
        />
        <Stack.Screen
          name="alarm/object-hunt"
          options={{ presentation: "fullScreenModal", gestureEnabled: false }}
        />
        <Stack.Screen
          name="scan/[purpose]"
          options={{ presentation: "fullScreenModal", gestureEnabled: false }}
        />
      </Stack>
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
