import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

/** Minimal structural shape of the props expo-router passes to `tabBar`. */
interface TabRoute {
  key: string;
  name: string;
}
interface TabBarProps {
  state: { index: number; routes: TabRoute[] };
  navigation: {
    emit: (event: {
      type: "tabPress";
      target?: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "moon",
  timetable: "list",
  qibla: "compass",
  history: "flame",
  settings: "settings-sharp",
};

/**
 * Translucent floating tab bar: a blurred glass panel with an opacity
 * gradient so content fades beneath it. Haptic tap on every selection.
 */
export function BlurTabBar({ state, navigation }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom || theme.spacing.md }]}>
      <LinearGradient
        colors={["transparent", theme.colors.background]}
        style={styles.fade}
        pointerEvents="none"
      />
      <BlurView
        intensity={35}
        tint={theme.blurTint}
        style={[styles.bar, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceTranslucent }]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const iconName = ICONS[route.name] ?? "ellipse";
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
                  navigation.navigate(route.name);
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
    height: 120,
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
