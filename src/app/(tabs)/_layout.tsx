import React from "react";
import { Tabs } from "expo-router";
import { BlurTabBar } from "@/components/navigation/BlurTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BlurTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Today" }} />
      <Tabs.Screen name="timetable" options={{ title: "Times" }} />
      <Tabs.Screen name="qibla" options={{ title: "Qibla" }} />
      <Tabs.Screen name="history" options={{ title: "Streaks" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
