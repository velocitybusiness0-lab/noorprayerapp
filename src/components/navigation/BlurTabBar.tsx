import React, { useMemo, useSyncExternalStore } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname, useRootNavigationState, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { tabBarVisibilityRegistry } from "@/features/navigation/TabBarVisibilityRegistry";
import { TabBarVisibilityPolicy } from "@/features/navigation/TabBarVisibilityPolicy";

const VISIBLE_TABS = ["index", "timetable", "qibla", "history", "settings"] as const;

const ICONS: Record<(typeof VISIBLE_TABS)[number], keyof typeof Ionicons.glyphMap> = {
  index: "moon",
  timetable: "list",
  qibla: "compass",
  history: "flame",
  settings: "settings-sharp",
};

/**
 * Translucent floating tab bar — blurred glass with a soft fade so scrolled
 * content dissolves beneath it instead of clipping hard.
 */
export function BlurTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const segments = useSegments();
  const rootState = useRootNavigationState();
  const registryHidden = useSyncExternalStore(
    (listener) => tabBarVisibilityRegistry.subscribe(listener),
    () => tabBarVisibilityRegistry.isHidden(),
    () => false
  );

  const activeRouteNames = useMemo(
    () => TabBarVisibilityPolicy.activeRouteNames(rootState),
    [rootState]
  );

  const visibleRoutes = useMemo(
    () =>
      state.routes.filter((route) =>
        VISIBLE_TABS.includes(route.name as (typeof VISIBLE_TABS)[number])
      ),
    [state.routes]
  );

  const focusedRouteName = state.routes[state.index]?.name;
  const fadeEnd = theme.isDark ? "rgba(42,49,64,0.92)" : "rgba(247,244,239,0.92)";

  const hidden = TabBarVisibilityPolicy.shouldHide({
    registryHidden,
    pathname,
    segments: segments as string[],
    activeRouteNames,
  });

  if (hidden) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: insets.bottom || theme.spacing.md }]}
    >
      <LinearGradient
        colors={["transparent", fadeEnd]}
        locations={[0, 1]}
        style={styles.fade}
        pointerEvents="none"
      />
      <BlurView
        intensity={28}
        tint={theme.blurTint}
        style={[
          styles.bar,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surfaceTranslucent,
          },
        ]}
      >
        {visibleRoutes.map((route) => {
          const focused = focusedRouteName === route.name;
          const iconName = ICONS[route.name as (typeof VISIBLE_TABS)[number]];
          const tint = focused ? theme.colors.accent : theme.colors.textTertiary;

          return (
            <Pressable
              key={route.key}
              style={styles.item}
              onPress={() => {
                haptics.selection();
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                  });
                }
              }}
            >
              <Ionicons name={iconName} size={22} color={tint} />
              <ThemedText
                variant="caption"
                color={focused ? "accent" : "textTertiary"}
                style={styles.label}
              >
                {labelFor(route.name)}
              </ThemedText>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

function labelFor(routeName: string): string {
  switch (routeName) {
    case "index":
      return "Today";
    case "timetable":
      return "Times";
    case "qibla":
      return "Qibla";
    case "history":
      return "Progress";
    case "settings":
      return "Settings";
    default:
      return routeName;
  }
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 128,
  },
  bar: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    paddingHorizontal: 8,
    overflow: "hidden",
    width: "92%",
    justifyContent: "space-around",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: { fontSize: 11 },
});
